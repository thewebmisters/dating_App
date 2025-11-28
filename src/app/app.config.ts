import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './auth-interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideHttpClient(
      withFetch(), 
      withInterceptorsFromDi() 
    ), 
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true, // This is important, it allows multiple interceptors
        },
    providePrimeNG({
      theme: {
        preset: Aura
      },
      ripple: true
    }),
      MessageService,
      
  ]
};
