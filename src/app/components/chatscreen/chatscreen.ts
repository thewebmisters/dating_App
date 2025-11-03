import { UserDTO } from './../../data/auth-dto';
import { MessageService } from 'primeng/api';
import { AuthService } from './../../services/auth-service';
import { Component } from '@angular/core';
import { ToastModule } from "primeng/toast";
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatscreen',
  imports: [ToastModule],
  templateUrl: './chatscreen.html',
  styleUrl: './chatscreen.css'
})
export class Chatscreen {
  email:string | null=null;
  password:string | null=null;
  user!:UserDTO;
  name:string | null=null;
constructor(
  private authService:AuthService,
  private messageService:MessageService,
  private router:Router
){}
ngOnInit(){
  const email = sessionStorage.getItem('email');
  if(email){
    this.email=email;
  }
  const password = sessionStorage.getItem('password');
  if(password){
    this.password=password;
  }
  this.fetchUserDetails();
}
fetchUserDetails(){
  const body={
    email:this.email,
    password:this.password
  }
  this.authService.getUserDetails().subscribe({
    next:(response)=>{
      this.user=response.data;
      this.name=this.user.name;
    },
    error:(err)=>{
     this.handleApiError(err);
    }
  })
}
handleLogout(){
  this.router.navigate(['/login']);
 
//   this.authService.logout().subscribe({
//     next:(response)=>{
// this.messageService.add({
//               severity: 'success',
//       summary: 'Success',
//       detail:   response?.message || 'Logged out successfully' ,
//       life: 3000,
//         })
//     },
//    error:(err)=>{
//      this.handleApiError(err);
//     }
//   })
}
handleApiError(err:any){
  return(
    this.messageService.add({
              severity: 'error',
      summary: 'Error',
      detail:   err?.error?.message ,
      life: 3000,
        })
  )
}
}
