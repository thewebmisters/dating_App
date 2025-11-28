import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule, ButtonModule, ToastModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
  providers: [MessageService],
})
export class Signup {
  signupForm!: FormGroup;
  charLength: number = 255;
  emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/;
  passwordLength: number = 8;
  isLoading:boolean=false;
  userDetails:any;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
   
  ) {}
  ngOnInit() {
    this.initializeSignupForm();
  }
  initializeSignupForm(): void {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.maxLength(255)]],
        email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
        //email: ['', Validators.required],
        password: [
          '',
          [Validators.required, Validators.minLength(8), Validators.pattern(this.passwordPattern)],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // ✅ Define the validator as a class method
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
     if (!password || !confirmPassword) return null;
if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
      return null; // Preserve other errors
    }
if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPassword.setErrors(null);
      return null;
    }
  };
  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'please fill all the required data correctly',
      life: 3000,
    });
  }
  showSuccess(){
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'please fill all the required data correctl',
      life: 3000,
    });
  }
    /**
   * Toggles the visibility of a password field.
   * @param field The field to toggle ('password' or 'confirmPassword')
   */
  toggleVisibility(field: string): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  validateForm() {
    this.signupForm.markAllAsTouched();
    if (!this.signupForm.valid) {
      this.showError();
      return;
    }
    this.registerUser();
  }
  registerUser(): void {
    const formData = this.signupForm.value;
    const body = {
      name: formData?.name,
      email: formData?.email,
      password: formData?.password,
      password_confirmation: formData?.confirmPassword,
      remember: '',
    };
    this.isLoading=true;
    this.authService.register(body).subscribe({
      next: (response) => {
         this.isLoading=false;
         this.userDetails=response.user;
if(response && response.token){
       sessionStorage.setItem('token',response.token);
        }
          if( this.userDetails.role==='user' ){
          this.router.navigate(['client-home']);
} else if(this.userDetails.role==='writer'){
         this.router.navigate(['writer-dashboard']);
          }else{
           this.router.navigate(['client-home']);
          }
           
},
      error: (err) => {
          this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: err.error?.message,
      life: 3000,
    });
    this.isLoading=false;
      },
    });
  }
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
