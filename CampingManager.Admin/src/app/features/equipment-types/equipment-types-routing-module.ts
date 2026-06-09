import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipmentTypeFormPageComponent } from './pages/equipment-type-form-page/equipment-type-form-page.component';
import { EquipmentTypesListPageComponent } from './pages/equipment-types-list-page/equipment-types-list-page.component';

const routes: Routes = [
  { path: '', component: EquipmentTypesListPageComponent },
  { path: 'new', component: EquipmentTypeFormPageComponent },
  { path: ':id/edit', component: EquipmentTypeFormPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentTypesRoutingModule {}
