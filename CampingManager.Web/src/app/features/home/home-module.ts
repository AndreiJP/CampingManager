import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared-module";
import { HomeRoutingModule } from "./home-routing-module";
import { AccommodationSelectorComponent } from "./sections/availability-booking/components/accommodation-selector/accommodation-selector.component";
import { AvailabilityDateFieldComponent } from "./sections/availability-booking/components/availability-date-field/availability-date-field.component";
import { GuestSelectorComponent } from "./sections/availability-booking/components/guest-selector/guest-selector.component";
import { HighlightsSectionComponent } from "./sections/highlights-section/highlights-section.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { AvailabilityBookingComponent } from "./sections/availability-booking/availability-booking.component";
import { SiteHeroComponent } from "./sections/site-hero/site-hero.component";

@NgModule({
  declarations: [
    AvailabilityBookingComponent,
    HomePageComponent,
    SiteHeroComponent,
  ],
  imports: [
    SharedModule,
    HomeRoutingModule,
    AccommodationSelectorComponent,
    AvailabilityDateFieldComponent,
    GuestSelectorComponent,
    HighlightsSectionComponent,
  ],
})
export class HomeModule {}
