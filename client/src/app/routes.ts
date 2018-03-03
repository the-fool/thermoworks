import { Routes } from '@angular/router'
import { NotFoundPageComponent } from './core/containers/not-found-page'

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule',
    canActivate: [],
  },
  { path: '**', component: NotFoundPageComponent },
]
