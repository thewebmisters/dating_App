
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Tabs, TabPanel } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ToggleSwitch } from 'primeng/toggleswitch';

import { AccountService } from '../../services/account-service';
import { AuthenticatedUserDTO } from '../../data/auth-dto';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-account-settings',
  standalone: true, // Assuming you are using standalone components
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    Tabs,
    TabPanel,
    InputTextModule,
    ButtonModule,
    Textarea,
    FileUploadModule,
    ToggleSwitch
  ],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css',
  providers: [MessageService]
})
export class AccountSettings implements OnInit {
  profileForm: FormGroup;
  settingsForm: FormGroup;
  galleryPhotos: any[] = [];

  // Property to hold the full user details for display
  currentUser: AuthenticatedUserDTO | null = null;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private authService: AuthService,
    private messageService: MessageService,
    private location: Location
  ) {
    // Initialize Profile Form
    this.profileForm = this.fb.group({
      name: [''],
      bio: [''],
      phone: [''],
      city: [''],
      country: ['']
    });

    // Initialize Settings Form
    this.settingsForm = this.fb.group({
      notifications_enabled: [true],
      email_notifications: [true],
      show_online_status: [true]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    // Fetch current user details
    this.authService.getUserDetails().subscribe({
      next: (user: AuthenticatedUserDTO) => {
        this.currentUser = user;
        if (user) {
          this.profileForm.patchValue(user); // Pre-fill the form
        }
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user details'
        });
      }
    });

    this.accountService.getSettings().subscribe({
      next: (response: any) => {
        this.settingsForm.patchValue(response.data);
      },
      error: (err: any) => {
        console.error('Failed to load settings:', err);
      }
    });

    this.accountService.getGallery().subscribe({
      next: (response: any) => {
        this.galleryPhotos = response.data;
      },
      error: (err: any) => {
        console.error('Failed to load gallery:', err);
      }
    });
  }

  onProfileSubmit(): void {
    if (this.profileForm.invalid) return;

    this.accountService.updateAccountDetails(this.profileForm.value).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully!' });
        // Optionally refetch user data to update the header
        this.authService.getUserDetails().subscribe();
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to update profile.' });
      }
    });
  }

  onSettingsSubmit(): void {
    if (this.settingsForm.invalid) return;

    this.accountService.updateSettings(this.settingsForm.value).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Settings updated successfully!' });
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to update settings.' });
      }
    });
  }

  onProfilePhotoUpload(event: any): void {
    const file = event.files[0];
    if (file) {
      this.accountService.updateProfilePhoto(file).subscribe({
        next: (response: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile photo updated!' });
          // Refetch user data to show the new photo
          this.authService.getUserDetails().subscribe();
        },
        error: (err: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Upload failed.' });
        }
      });
    }
  }

  /**
   * Navigate back to the previous page
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Get appropriate back button text based on user context
   */
  getBackButtonText(): string {
    // Simple approach - just use "Back" for all cases
    // Could be enhanced later to show "Back to Dashboard", "Back to Chat", etc.
    return 'Back';
  }
}