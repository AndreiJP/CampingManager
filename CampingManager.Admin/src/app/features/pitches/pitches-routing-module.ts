import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PitchFormPageComponent } from './pages/pitch-form-page/pitch-form-page.component';
import { PitchesListPageComponent } from './pages/pitches-list-page/pitches-list-page.component';

const routes: Routes = [
  { path: '', component: PitchesListPageComponent },
  { path: 'new', component: PitchFormPageComponent },
  { path: ':id/edit', component: PitchFormPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PitchesRoutingModule {}
