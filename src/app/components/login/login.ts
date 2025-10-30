import { AuthService } from './../../services/auth-service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  imports: [ToastModule,ButtonModule,CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',

})
export class Login {
  loginForm!:FormGroup;
  retrievedEmail!:string | null;
  retrievedPassword!:string | null;
  constructor(
private fb:FormBuilder,
private router:Router,
private messageService:MessageService,
private authService:AuthService
  ){}
ngOnInit(){
  this.initializeLoginForm();
  this.retrievedEmail= sessionStorage.getItem('email');
  this.retrievedPassword = sessionStorage.getItem('password');
  if(this.retrievedEmail){
this.loginForm.patchValue({email:this.retrievedEmail});
  }
  if(this.retrievedPassword){
    this.loginForm.patchValue({password:this.retrievedPassword});
  }
}
initializeLoginForm():void{
  this.loginForm = this.fb.group({
email:['',Validators.required],
password:['',Validators.required]
  })
}
onClickLogin():void{
  this.loginForm.markAllAsTouched();
  if(!this.loginForm.valid){
    this.showError();
    return;
  }
  this.login();
}
showError() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'please fill all the required data correctly', life: 3000 });
    }
    login():void{
      const formData = this.loginForm.value;
      const body={
        email:formData?.email,
        password:formData?.password
      }
      this.authService.login(body).subscribe({
        next:(response)=>{
          this.router.navigate(['chat-screen']);
          this.messageService.add({
              severity: 'success',
      summary: 'Success',
      detail: response.message,
      life: 3000,
        })
        sessionStorage.clear();
        },
        error:(err)=>{
           this.messageService.add({
              severity: 'error',
      summary: 'Error',
      detail:  err.error?.errors?.email,
      life: 3000,
        })
        }
      })
    }
navigateToSignUp():void{
  this.router.navigate(['signup']);
}
}
