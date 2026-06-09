import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { ReservationsRoutingModule } from './reservations-routing-module';
import { ReservationFormPageComponent } from './pages/reservation-form-page/reservation-form-page.component';
import { ReservationsListPageComponent } from './pages/reservations-list-page/reservations-list-page.component';

@NgModule({
  declarations: [ReservationsListPageComponent, ReservationFormPageComponent],
  imports: [SharedModule, ReservationsRoutingModule],
})
export class ReservationsModule {}
