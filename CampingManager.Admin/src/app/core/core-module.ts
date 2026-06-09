import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

@NgModule({
  declarations: [AdminLayoutComponent],
  imports: [CommonModule, RouterModule],
  exports: [AdminLayoutComponent],
})
export class CoreModule {}
