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
  imports: [ToastModule, ButtonModule, CommonModule, ReactiveFormsModule],
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
        identifier:formData?.email,
        password:formData?.password,
        //abilities:''
      }
        this.isLoading=true; 
      this.authService.login(body).subscribe({
         next:(response)=>{
           this.isLoading=false;
         this.userDetails=response.user;
          if(response && response.token){
       sessionStorage.setItem('token',response.token);
        }
          if(response.role==='user' ){
           this.router.navigate(['client-home']);
} else  if(response.role==='writer'){
           this.router.navigate(['writer-dashboard']); 
          }else{
           this.router.navigate(['client-home']);  
          }
      
       },
        error:(err)=>{
          this.isLoading=false;
           this.messageService.add({
              severity: 'error',
      summary: 'Error',
      detail:  err.error?.errors?.email || err.error?.message,
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
