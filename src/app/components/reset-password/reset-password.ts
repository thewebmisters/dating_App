import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DataService } from '../../services/data-service';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  isLoading: boolean = false;
  passwordForm!: FormGroup;
  passwordVisible: boolean = false;
  emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  constructor(private fb: FormBuilder,
    private messageService: MessageService,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) { }
  ngOnInit() {
    this.initializePasswordForm();
  }
  initializePasswordForm(): void {
    this.passwordForm = this.fb.group({
      token: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]

    })
  }
  toggleVisibility(field: string) {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    }
  }
  onSubmit() {
    this.passwordForm.markAllAsTouched();
    const formData = this.passwordForm.value;

    if (this.passwordForm.invalid) {

      this.dataService.handleFormError('Please fill all the data required correctly!');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      this.dataService.handleFormError('Passwords do not match!');
      return;
    } else {
      const payload = {
        token: formData.token,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword
      }
      this.isLoading = true;
      this.authService.resetPassword(payload).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.dataService.handleSuccess(response);
          this.router.navigate(['/signin']);
        },
        error: (err) => {
          this.isLoading = false;
          this.dataService.handleApiError(err);
        }
      })
    }
  }
}
