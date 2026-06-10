import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { HomeRoutingModule } from './home-routing-module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AvailabilityBookingComponent } from './sections/availability-booking/availability-booking.component';
import { SiteHeroComponent } from './sections/site-hero/site-hero.component';
import { SiteNavbarComponent } from './sections/site-navbar/site-navbar.component';

@NgModule({
  declarations: [
    AvailabilityBookingComponent,
    HomePageComponent,
    SiteHeroComponent,
    SiteNavbarComponent,
  ],
  imports: [
    SharedModule,
    HomeRoutingModule,
  ],
})
export class HomeModule {}
