
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, ɵSERVER_CONTEXT as SERVER_CONTEXT } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // THIS IS THE KEY:
    // We provide the SERVER_CONTEXT and explicitly disable prerendering.
    {
      provide: SERVER_CONTEXT,
      useValue: { prerender: false },
    },
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);