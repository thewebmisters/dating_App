import { AuthService } from './../../services/auth-service';
import { CommonModule } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID, HostListener } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { AuthenticatedUserDTO, Writer } from '../../data/auth-dto';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../../services/data-service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.html',
  styleUrls: ['./client-home.css'],
  imports: [AvatarModule, AvatarGroupModule, CardModule, CommonModule, DialogModule]
})
export class ClientHome {
  userDetails!: AuthenticatedUserDTO;
  imageSrc: string = '/assets/images/mainlogo.jpg';
  writerProfiles: Writer[] = [];
  selectedProfile: Writer | null = null;
  visible: boolean = false;
  isBioTruncated: boolean = true;
  readonly bioMaxLength: number = 50;
  isDropdownOpen = false;
  constructor(private authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  ngOnInit() {
    this.fetchAuthenticatedUsrDetails();
    this.fetchProfiles();
  }
  fetchAuthenticatedUsrDetails(): void {
    this.authService.getUserDetails().subscribe({
      next: (response) => {
        this.userDetails = response;
        // console.log('user details',this.userDetails.wallet);
      },
      error: (err) => {
        this.dataService.handleApiError(err);
      }
    })
  }
  fetchProfiles() {
    this.authService.getProfiles().subscribe({
      next: (response) => {
        this.writerProfiles = response;
      },
      error: (err) => {
        this.dataService.handleApiError(err);
      }
    })
  }
  openProfileCard(profile: Writer) {
    this.visible = true;
    this.selectedProfile = profile;
    //console.log('profile id',this.selectedProfile.id);
    this.isBioTruncated = true;
  }
  closeProfileDialog() {
    this.visible = false;
    setTimeout(() => {
      this.selectedProfile = null;
    }, 300);

  }
  toggleBio() {
    this.isBioTruncated = !this.isBioTruncated;
  }
  /**
   * Get user's token count safely
   */
  getUserTokens(): number {
    return this.userDetails?.wallet?.tokens || 0;
  }

  /**
   * Check if user has tokens
   */
  hasTokens(): boolean {
    return this.getUserTokens() > 0;
  }

  checkCreditBal(profile: Writer): void {
    // console.log('profile id>', profile.id);

    if (!this.hasTokens()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Insufficient Tokens',
        detail: 'You need tokens to start a chat. Redirecting to purchase tokens...'
      });

      setTimeout(() => {
        this.router.navigate(['/buy-credit']);
      }, 2000);
    } else {
      this.router.navigate(['/client-chat', profile.id]);
      // this.dataService.setId(profile.id);
      sessionStorage.setItem('user', JSON.stringify(this.userDetails));
    }
  }
  logout(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response || 'logged out successfully' });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.dataService.handleApiError(err);
        this.router.navigate(['/login']);
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
    this.router.navigate(['/account']);
  }

  navigateToBuyCredit(): void {
    this.router.navigate(['/buy-credit']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Close dropdown when clicking outside
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }
}
