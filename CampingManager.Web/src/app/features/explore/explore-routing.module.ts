import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: 'about', loadComponent: () => import('./about-page/about-page.component').then(m => m.AboutPageComponent) },
  { path: 'activities', loadComponent: () => import('./activities-page/activities-page.component').then(m => m.ActivitiesPageComponent) },
  { path: 'rules', loadComponent: () => import('./rules-page/rules-page.component').then(m => m.RulesPageComponent) }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExploreRoutingModule { }
