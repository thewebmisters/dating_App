import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  signupForm!:FormGroup;
constructor(
  private fb:FormBuilder
){}
ngOnInit(){}
initializeSignupForm():void{
  this.signupForm =  this.fb.group({
    name:['',Validators.required],
    email:['',Validators.required],
    password:['',Validators.required],
    confirmPassword:['',Validators.required]
   
    
  })
}
}
