import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { EquipmentTypesRoutingModule } from './equipment-types-routing-module';
import { EquipmentTypeFormPageComponent } from './pages/equipment-type-form-page/equipment-type-form-page.component';
import { EquipmentTypesListPageComponent } from './pages/equipment-types-list-page/equipment-types-list-page.component';

@NgModule({
  declarations: [EquipmentTypesListPageComponent, EquipmentTypeFormPageComponent],
  imports: [SharedModule, EquipmentTypesRoutingModule],
})
export class EquipmentTypesModule {}
