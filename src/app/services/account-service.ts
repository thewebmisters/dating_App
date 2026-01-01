import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  // === PROFILE ENDPOINTS ===
  getAccountDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/account`);
  }

  updateAccountDetails(payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/account`, payload);
  }

  updateProfilePhoto(photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', photo, photo.name);
    return this.http.post(`${this.baseUrl}/account/profile-photo`, formData);
  }

  // === GALLERY ENDPOINTS ===
  getGallery(): Observable<any> {
    return this.http.get(`${this.baseUrl}/account/gallery`);
  }

  addGalleryPhoto(photo: File, caption: string): Observable<any> {
    const formData = new FormData();
    formData.append('photo', photo, photo.name);
    formData.append('caption', caption);
    return this.http.post(`${this.baseUrl}/account/gallery`, formData);
  }

  deleteGalleryPhoto(photoId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/account/gallery/${photoId}`);
  }

  // === SETTINGS ENDPOINTS ===
  getSettings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/settings`);
  }

  updateSettings(payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/settings`, payload);
  }
}