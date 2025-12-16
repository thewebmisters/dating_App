import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app'; // Assuming 'App' is your AppComponent
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;