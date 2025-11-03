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
  constructor(
private fb:FormBuilder,
private router:Router,
private messageService:MessageService,
private authService:AuthService
  ){}
ngOnInit(){
  this.initializeLoginForm();
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
//           if(response.data.guard==='client' || 'writer'){
//  console.log('client is',response.data.guard);
//  sessionStorage.setItem('email',body?.email);
//  sessionStorage.setItem('password',body?.password);
//   this.router.navigate(['chat-screen']);

  
//           } 
//           if(response.data.guard==='web'){
//             console.log('admin is',response.data.guard);
//            this.router.navigate(['admin-panel']); 
//           }
         
          this.messageService.add({
              severity: 'success',
      summary: 'Success',
      detail: response.message,
      life: 3000,
        })
       if(response && response.data && response.data.access_token){
       sessionStorage.setItem('token',response.data.access_token);
        }
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
navigateToPsdScreen():void{
  this.router.navigate(['forgot-password']);
}
}
