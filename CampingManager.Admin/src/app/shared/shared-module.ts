import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmptyStateComponent } from './ui/empty-state/empty-state.component';
import { PageHeaderComponent } from './ui/page-header/page-header.component';

@NgModule({
  declarations: [EmptyStateComponent, PageHeaderComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    EmptyStateComponent,
    PageHeaderComponent,
  ],
})
export class SharedModule {}
