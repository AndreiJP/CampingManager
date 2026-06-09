import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth-module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard-module').then((m) => m.DashboardModule),
      },
      {
        path: 'customers',
        loadChildren: () => import('./features/customers/customers-module').then((m) => m.CustomersModule),
      },
      {
        path: 'pitches',
        loadChildren: () => import('./features/pitches/pitches-module').then((m) => m.PitchesModule),
      },
      {
        path: 'equipment-types',
        loadChildren: () =>
          import('./features/equipment-types/equipment-types-module').then((m) => m.EquipmentTypesModule),
      },
      {
        path: 'reservations',
        loadChildren: () => import('./features/reservations/reservations-module').then((m) => m.ReservationsModule),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
