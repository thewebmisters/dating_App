import { Injectable } from '@angular/core';
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
  setChatId(chatId:number){
   this.chatId=chatId; 
  }
  getChatId(){
    return this.chatId;
  }

//common method for handling error response
handleApiError(err:any){
 this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: err.error?.message,
      life: 3000,
    });
  }
  }