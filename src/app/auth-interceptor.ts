import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth-service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // 1. Get the authentication token from the AuthService
    const authToken = this.authService.getAccessToken();

    // 2. Check if the token exists
    if (authToken) {
      // 3. If the token exists, clone the request and add the Authorization header.
      // Requests are immutable, so you must clone them to modify.
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${authToken}`)
      });

      // 4. Pass the cloned, authenticated request to the next handler
      return next.handle(authReq);
    }

    // 5. If no token exists, pass the original request without modification
    return next.handle(request);
  }
}