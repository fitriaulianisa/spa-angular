import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FakultasComponent } from './components/fakultas/fakultas.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'fakultas', component: FakultasComponent }
];

