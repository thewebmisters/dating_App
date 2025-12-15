import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule  } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { DataService } from '../../services/data-service';
import { Toast } from "primeng/toast";
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, Toast, ProgressSpinnerModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  forgotPasswordForm!:FormGroup;
  isLoading:boolean=false;
    emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
constructor(private router:Router,
  private fb:FormBuilder,
  private authService:AuthService,
  private dataService:DataService,
  private messageService:MessageService
){}
ngOnInit(){
  this.initializeForm();
}
initializeForm(){
  this.forgotPasswordForm =  this.fb.group({
     email: ['', [Validators.required, Validators.pattern(this.emailPattern)]]
  })
}
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
  forgotPassword():void{
    this.forgotPasswordForm.markAllAsTouched();
    if(this.forgotPasswordForm.invalid){
      this.dataService.handleFormError('Please fill all the data required correctly!');
      return;
    }
    this.isLoading=true;
    const userEmail=this.forgotPasswordForm.value;
    const email=userEmail
     this.authService.forgotPassword(email).subscribe({
      next:(response)=>{
        this.isLoading=false;
  this.dataService.handleSuccess(response);
this.router.navigate(['/reset']);
      },
      error:(err)=>{
        this.isLoading=false;
        this.dataService.handleApiError(err);
      }
    })
  }
}
