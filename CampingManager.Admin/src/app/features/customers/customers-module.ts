import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { CustomersRoutingModule } from './customers-routing-module';
import { CustomerFormPageComponent } from './pages/customer-form-page/customer-form-page.component';
import { CustomersListPageComponent } from './pages/customers-list-page/customers-list-page.component';

@NgModule({
  declarations: [CustomersListPageComponent, CustomerFormPageComponent],
  imports: [SharedModule, CustomersRoutingModule],
})
export class CustomersModule {}
