import { AuthService } from './../../services/auth-service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  imports: [ToastModule, ButtonModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',

})
export class Login {
  loginForm!:FormGroup;
  isLoading:boolean=false;
  userDetails:any;
   passwordVisible: boolean = false;
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
  /**
   * Toggles the visibility of a password field.
   * @param field The field to toggle ('password' or 'confirmPassword')
   */
  toggleVisibility(field: string): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } 
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
        this.isLoading=true; 
      this.authService.login(body).subscribe({
         next:(response)=>{
         this.userDetails=response.data.user;
           sessionStorage.setItem('user',JSON.stringify(this.userDetails));
           this.router.navigate(['client-home']);
          if(response.data.guard==='client' ){
          

  this.router.navigate(['client-home']);

  
          } 
          if(response.data.guard==='writer'){
           this.router.navigate(['chat-screen']); 
          }
       if(response && response.data && response.data.access_token){
       sessionStorage.setItem('token',response.data.access_token);
        }
         this.isLoading=false;
        },
        error:(err)=>{
          this.isLoading=false;
           this.messageService.add({
              severity: 'error',
      summary: 'Error',
      detail:  err.error?.errors?.email,
      life: 3000,
        })
         this.isLoading=false;
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
