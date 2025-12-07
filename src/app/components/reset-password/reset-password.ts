import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
isLoading:boolean=false;
passwordForm!:FormGroup;
passwordVisible:boolean=false;
constructor(private fb:FormBuilder){}
ngOnInit(){
  this.initializePasswordForm();
}
initializePasswordForm():void{
  this.passwordForm=this.fb.group({
    email:['',Validators.required],
    password:['',Validators.required],
    confirmPassword:['',Validators.required]

  })
}
toggleVisibility(password:string){

}
}
