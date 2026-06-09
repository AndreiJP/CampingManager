import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { PitchesRoutingModule } from './pitches-routing-module';
import { PitchFormPageComponent } from './pages/pitch-form-page/pitch-form-page.component';
import { PitchesListPageComponent } from './pages/pitches-list-page/pitches-list-page.component';

@NgModule({
  declarations: [PitchesListPageComponent, PitchFormPageComponent],
  imports: [SharedModule, PitchesRoutingModule],
})
export class PitchesModule {}
