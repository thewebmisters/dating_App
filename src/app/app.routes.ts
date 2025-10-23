import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';

export const routes: Routes = [
    {path:'landing-page',component:LandingPage},
    {path:'',component:LandingPage}
];

