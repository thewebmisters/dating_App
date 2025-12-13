import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TokenPackageDto, TokenPackagesResponseDto } from '../data/tokens-dto';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
   private baseUrl = environment.baseUrl;
   constructor(private http:HttpClient){}
   getPackages():Observable< TokenPackagesResponseDto>{
    const fullUrl = `${this.baseUrl}/tokens/packages`;
    return this.http.get< TokenPackagesResponseDto>(fullUrl)

   }
}
