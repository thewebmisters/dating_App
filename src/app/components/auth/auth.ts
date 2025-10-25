
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  signupForm!:FormGroup;
  charLength:number=255;
  emailPattern:string='^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
 passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/;
passwordLength:number=8;
constructor(
  private fb:FormBuilder,
  //private snackBar:MatSnackBarModule
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
   
    
  })
}
validateForm(){
  this.signupForm.markAllAsTouched();
  if(!this.signupForm.valid){
//alert('failed');
  }
}
}
