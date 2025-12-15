import { Injectable } from '@angular/core';
import { response } from 'express';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  writerId!:number;
  chatId!:number;
  constructor(private messageService:MessageService){}
  setId(id:number){
this.writerId=id;
  }
  getId(){
    return this.writerId;
  }
  setChatId(chatId:number):void{
   this.chatId=chatId; 
  }
  getChatId():number{
    return this.chatId;
  }

//common method for handling error response
handleApiError(err:any){
 this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: err.error?.message  || 'Failed to load resource',
      life: 3000,
    });
  }
  handleFormError(err:any){
 this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: err,
      life: 3000,
    });
  }
  handleSuccess(response:any){
    this.messageService.add({severity:'success',summary:'Success',detail:response.message || 'success!',life:300})
  }
  }