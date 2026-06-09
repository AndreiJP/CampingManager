import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerFormPageComponent } from './pages/customer-form-page/customer-form-page.component';
import { CustomersListPageComponent } from './pages/customers-list-page/customers-list-page.component';

const routes: Routes = [
  { path: '', component: CustomersListPageComponent },
  { path: 'new', component: CustomerFormPageComponent },
  { path: ':id/edit', component: CustomerFormPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule {}
