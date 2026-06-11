import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [SharedModule],
  template: `
    <app-site-navbar></app-site-navbar>
    <app-content-block title="Contattaci" content="<p>Siamo a tua disposizione per ogni informazione.</p>"></app-content-block>
    <app-contact-form></app-contact-form>
    <app-site-footer></app-site-footer>
  `
})
export class ContactPageComponent { }
