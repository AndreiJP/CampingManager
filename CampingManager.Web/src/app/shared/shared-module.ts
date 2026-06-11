import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ExperienceSectionComponent } from './ui/experience-section/experience-section.component';
import { ContentBlockComponent } from './ui/content-block/content-block.component';
import { GalleryGridComponent } from './ui/gallery-grid/gallery-grid.component';
import { ContactFormComponent } from './ui/contact-form/contact-form.component';
import { SiteNavbarComponent } from '../features/home/sections/site-navbar/site-navbar.component';
import { SiteFooterComponent } from '../features/home/sections/site-footer/site-footer.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ExperienceSectionComponent, ContentBlockComponent, GalleryGridComponent, ContactFormComponent, SiteNavbarComponent, SiteFooterComponent],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ExperienceSectionComponent, ContentBlockComponent, GalleryGridComponent, ContactFormComponent, SiteNavbarComponent, SiteFooterComponent],
})
export class SharedModule {}
