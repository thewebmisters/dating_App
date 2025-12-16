import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server'; // <-- Import from @angular/platform-server
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering() // <-- Just call the function with no arguments
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);