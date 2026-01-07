import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SendMessagePayload, Writer } from '../../data/auth-dto';
import { AvatarModule } from 'primeng/avatar';
import { Chat } from '../../services/chat';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth-service';
import { DataService } from '../../services/data-service';
import { WebSocketService } from '../web-socket-service';
import { Button } from "primeng/button";
import { MenuModule } from 'primeng/menu';
import { Dialog, DialogModule } from "primeng/dialog";
import { FileUploadService, AttachmentData, Base64AttachmentData } from '../../services/file-upload.service';

@Component({
  selector: 'app-client-chat',
  imports: [FormsModule, CommonModule, DialogModule, AvatarModule, Button, MenuModule, Dialog, ReactiveFormsModule],
  templateUrl: './client-chat.html',
  styleUrl: './client-chat.css',
})
export class ClientChat {
  writerProfile: Writer | null = null;
  messages: any = [];
  isSending = false; // To disable the button while sending
  userDetails: any;
  chatInput: string = '';
  isLoading = true;
  writerId!: number;
  userId: number | undefined = undefined;
  items: MenuItem[] | undefined;
  visible: boolean = false;
  private channelName = '';
  reportForm!: FormGroup;

  // File handling properties
  selectedFiles: File[] = [];
  attachments: Base64AttachmentData[] = [];
  isProcessingFiles = false;
  filePreviewUrls: { [key: string]: string } = {};
  isDropdownOpen = false;

  // Access the navigation state in the constructor.
  constructor(
    private router: Router,
    private chatService: Chat,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dataService: DataService,
    private webSocketService: WebSocketService,
    private fb: FormBuilder,
    private fileUploadService: FileUploadService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.writerProfile = navigation.extras.state['writerProfile'];
    }
  }

  ngOnInit() {
    this.initializeReportForm();
    if (isPlatformBrowser(this.platformId)) {
      const user = sessionStorage.getItem('user');
      if (user) {
        this.userDetails = JSON.parse(user);
        this.subscribeToClientChannel(this.userDetails.id);
      }
    }
    this.userId = this.userDetails?.id;
    const idFromUrl = this.route.snapshot.paramMap.get('id');
    if (idFromUrl) {
      // Convert the string from the URL to a number
      this.writerId = parseInt(idFromUrl, 10);

      // Now that we have a reliable ID, fetch the profile
      this.fetchProfileById(this.writerId);
    } else {
      // If there's no ID in the URL, something is wrong. Go back home.
      //console.error("No writer ID found in URL. Redirecting.");
      this.router.navigate(['/explore']);
    }
    this.items = [
      {
        label: 'Block',
        icon: 'pi pi-fw pi-ban',
        command: () => this.blockUser()
      },
      {
        label: 'Report',
        icon: 'pi pi-fw pi-flag-fill',
        command: () => this.showReportModal()
      }
    ];
  }

  initializeReportForm() {
    this.reportForm = this.fb.group({
      reason: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  subscribeToClientChannel(userId: number): void {
    this.channelName = `App.Models.User.${userId}`;
    //console.log('my channel is',this.channelName)
    this.webSocketService.listen(this.channelName, '.NewMessage', (eventData: any) => {
      //console.log('subscribed to event',eventData.message);
      if (eventData.message && eventData.message.sender_id === this.writerProfile?.id) {
        this.messages.push(eventData.message);
        this.scrollToBottom();
      } else {
        this.dataService.handleApiError("You Received a message for a different chat");
      }
    });
  }

  ngOnDestroy() {
    if (this.channelName) {
      this.webSocketService.leaveChannel(this.channelName);
    }
  }

  fetchProfileById(id: number) {
    this.isLoading = true;
    this.authService.getCurrentProfile(id).subscribe({
      next: (response) => {
        this.writerProfile = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.dataService.handleApiError(err);
        setTimeout(() => this.router.navigate(['dashboard']), 3000);
      },
    });
  }

  blockUser() {
    const payload = {
      blocked_id: this.writerId,
      reason: ''
    }
    this.chatService.blockUser(payload).subscribe({
      next: (response) => {
        this.dataService.handleSuccess(response);
        this.router.navigate(['/explore']);
      },
      error: (err) => {
        this.dataService.handleApiError(err);
      }
    })
  }

  showReportModal() {
    this.visible = true;
  }

  reportUser() {
    if (this.reportForm.invalid) {
      return;
    }

    const formValues = this.reportForm.value;
    const payload = {
      reason: formValues.reason,
      description: formValues.description
    }
    this.chatService.reportChat(payload).subscribe({
      next: (response) => {
        this.dataService.handleSuccess(response);
        this.visible = false;
        this.reportForm.reset();
      },
      error: (err) => {
        this.dataService.handleApiError(err);
      }
    })
  }

  // ===== FILE HANDLING METHODS =====

  /**
   * Handle file selection
   */
  async onFileSelected(event: any): Promise<void> {
    const files: FileList = event.target.files;
    this.selectedFiles = [];
    this.filePreviewUrls = {};

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = this.fileUploadService.validateFile(file);

      if (validation.valid) {
        this.selectedFiles.push(file);
        // Generate preview URL for display
        if (file.type.startsWith('image/')) {
          this.filePreviewUrls[file.name] = await this.fileUploadService.getFilePreviewUrl(file);
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'File Error',
          detail: `${file.name}: ${validation.error}`
        });
      }
    }
  }

  /**
   * Process selected files to attachments (convert to base64)
   */
  async processFiles(): Promise<void> {
    if (this.selectedFiles.length === 0) return;

    console.log('Processing files:', this.selectedFiles);
    this.isProcessingFiles = true;

    try {
      this.attachments = await this.fileUploadService.convertMultipleFiles(this.selectedFiles);
      console.log('Processed attachments:', this.attachments);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `${this.selectedFiles.length} file(s) ready to send`
      });

    } catch (error) {
      console.error('File processing error:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Processing Error',
        detail: 'Failed to process files'
      });
    } finally {
      this.isProcessingFiles = false;
      this.selectedFiles = [];
    }
  }

  /**
   * Remove attachment
   */
  removeAttachment(index: number): void {
    this.attachments.splice(index, 1);
  }

  /**
   * Remove selected file before processing
   */
  removeSelectedFile(index: number): void {
    const fileName = this.selectedFiles[index].name;
    this.selectedFiles.splice(index, 1);
    delete this.filePreviewUrls[fileName];
  }

  /**
   * Debug method to check attachments
   */
  debugAttachments(): void {
    console.log('=== DEBUG ATTACHMENTS ===');
    console.log('Selected files:', this.selectedFiles);
    console.log('Processed attachments:', this.attachments);
    console.log('File preview URLs:', this.filePreviewUrls);

    // Test with a simple attachment
    if (this.attachments.length === 0) {
      console.log('No attachments found. Creating test attachment...');
      const testAttachment = {
        type: 'file' as const,
        data: 'VGVzdCBmaWxlIGNvbnRlbnQ=', // "Test file content" in base64
        filename: 'test.txt',
        size: 17,
        mimeType: 'text/plain'
      };
      this.attachments.push(testAttachment);
      console.log('Test attachment added:', testAttachment);
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Debug Info',
      detail: `Selected: ${this.selectedFiles.length}, Processed: ${this.attachments.length}`
    });
  }

  /**
   * Test method to send a message with attachment
   */
  testSendWithAttachment(): void {
    if (!this.writerProfile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Writer profile not loaded.',
      });
      return;
    }

    // Create a test attachment if none exist
    if (this.attachments.length === 0) {
      const testAttachment = {
        type: 'file' as const,
        data: 'VGVzdCBmaWxlIGNvbnRlbnQ=', // "Test file content" in base64
        filename: 'test.txt',
        size: 17,
        mimeType: 'text/plain'
      };
      this.attachments.push(testAttachment);
    }

    this.chatInput = 'Test message with attachment';
    this.sendMessage();
  }

  /**
   * Get file size formatted
   */
  getFileSize(size: number): string {
    return this.fileUploadService.formatFileSize(size);
  }

  /**
   * Sends the user's message to the backend via the ChatService.
   */
  sendMessage(): void {
    // Guard clauses: Ensure we have a profile and a message to send
    if (!this.writerProfile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Writer profile not loaded.',
      });
      return;
    }

    if ((!this.chatInput.trim() && this.attachments.length === 0) || this.isSending) {
      return;
    }

    // Debug: Log attachments before sending
    console.log('=== SENDING MESSAGE DEBUG ===');
    console.log('Chat input:', this.chatInput);
    console.log('Attachments count:', this.attachments.length);
    console.log('Attachments data:', this.attachments);

    // Validate attachments have data
    this.attachments.forEach((attachment, index) => {
      console.log(`Attachment ${index}:`, {
        filename: attachment.filename,
        type: attachment.type,
        mimeType: attachment.mimeType,
        size: attachment.size,
        dataLength: attachment.data ? attachment.data.length : 0,
        hasData: !!attachment.data
      });
    });

    this.isSending = true;
    const payload: SendMessagePayload = {
      profile_id: this.writerProfile.id,
      content: this.chatInput.trim(),
      attachments: this.attachments, // Send base64 encoded attachments
    };

    // Debug: Log full payload structure
    console.log('=== PAYLOAD DEBUG ===');
    console.log('Full payload:', JSON.stringify(payload, null, 2));

    //  Clear the input immediately for a responsive feel
    this.chatInput = '';
    const tempAttachments = [...this.attachments];
    this.attachments = [];

    this.chatService.sendMessage(payload).subscribe({
      next: (response) => {
        console.log('=== SERVER RESPONSE DEBUG ===');
        console.log('Full server response:', JSON.stringify(response, null, 2));
        console.log('Response attachments:', response.data?.attachments);

        //  On SUCCESS, push the new message from the server's response to our array
        this.messages.push(response.data);
        this.isSending = false;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => {
        console.error('=== SEND MESSAGE ERROR ===');
        console.error('Error details:', err);
        this.dataService.handleApiError(err);
        // Put the failed message back in the input box so the user can retry
        this.chatInput = payload.content;
        this.attachments = tempAttachments;
        this.isSending = false;
      },
    });
  }

  /**
   * Open image in modal for full view
   */
  openImageModal(imageUrl: string): void {
    // You can implement a modal or open in new tab
    window.open(imageUrl, '_blank');
  }

  scrollToBottom() {
    const container = document.getElementById('messageArea');
    if (container) container.scrollTop = container.scrollHeight;
  }

  navigateToClientHome(): void {
    this.router.navigate(['/explore']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response || 'logged out successfully' });
        this.router.navigate(['/signin']);
      },
      error: (err) => {
        this.dataService.handleApiError(err);
        this.router.navigate(['/signin']);
      }
    })
  }

  toggleDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  navigateToAccount(): void {
    this.router.navigate(['/profile']);
  }

  navigateToBuyCredit(): void {
    this.router.navigate(['/purchase']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Close dropdown when clicking outside
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }
}