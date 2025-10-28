
import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup,ValidatorFn, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from "primeng/button";
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule, ButtonModule,ToastModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
  providers: [MessageService]
})
export class Signup {
  signupForm!:FormGroup;
  charLength:number=255;
  emailPattern:string='^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
 passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/;
passwordLength:number=8;
constructor(
  private fb:FormBuilder,
  private messageService:MessageService,
  private router:Router
){}
ngOnInit(){
  this.initializeSignupForm();
}
initializeSignupForm():void{
  this.signupForm =  this.fb.group({
    name:['',[Validators.required,Validators.maxLength(255)]],
    email:['',[Validators.required,Validators.pattern(this.emailPattern)]],
    password:['',[Validators.required,Validators.minLength(8),Validators.pattern(this.passwordPattern)]],
    confirmPassword:['',Validators.required,]
   
    
  },{validators: this.passwordMatchValidator })
}

  // ✅ Define the validator as a class method
  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'please fill all the required data correctly', life: 3000 });
    }
validateForm(){
  this.signupForm.markAllAsTouched();
  if(!this.signupForm.valid){
this.showError();
return;
  }
}
navigateToLogin():void{
this.router.navigate(['/login']);
}
}
