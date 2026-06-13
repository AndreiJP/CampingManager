import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslatePipe, TranslateDirective } from "@ngx-translate/core";
import { ContentBlockComponent } from "./ui/content-block/content-block.component";
import { ContactFormComponent } from "./ui/contact-form/contact-form.component";
import { SiteFooterComponent } from "./layout/site-footer/site-footer.component";
import { SiteNavbarComponent } from "./layout/site-navbar/site-navbar.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslatePipe,
    TranslateDirective,
    ContentBlockComponent,
    ContactFormComponent,
    SiteNavbarComponent,
    SiteFooterComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslatePipe,
    TranslateDirective,
    ContentBlockComponent,
    ContactFormComponent,
    SiteNavbarComponent,
    SiteFooterComponent,
  ],
})
export class SharedModule {}
