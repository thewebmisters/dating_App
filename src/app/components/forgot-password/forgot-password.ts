import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule  } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  forgotPasswordForm!:FormGroup;
constructor(private router:Router,
  private fb:FormBuilder
){}
ngOnInit(){
  this.initializeForm();
}
initializeForm(){
  this.forgotPasswordForm =  this.fb.group({
    email:['',Validators.required]
  })
}
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
