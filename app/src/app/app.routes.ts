import { Routes } from '@angular/router';
import { App } from './app';

export const routes: Routes = [
    { path: 'index.html', component: App },
    { path: '', redirectTo: 'index.html', pathMatch: 'full' },
    { path: '**', redirectTo: 'index.html', pathMatch: 'full' }
];
