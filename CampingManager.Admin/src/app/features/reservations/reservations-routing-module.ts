import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationFormPageComponent } from './pages/reservation-form-page/reservation-form-page.component';
import { ReservationsListPageComponent } from './pages/reservations-list-page/reservations-list-page.component';

const routes: Routes = [
  { path: '', component: ReservationsListPageComponent },
  { path: 'new', component: ReservationFormPageComponent },
  { path: ':id/edit', component: ReservationFormPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationsRoutingModule {}
