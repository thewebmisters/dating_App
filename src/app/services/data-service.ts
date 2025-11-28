import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  writerId!:number;
  setId(id:number){
this.writerId=id;
  }
  getId(){
    return this.writerId;
  }
}
