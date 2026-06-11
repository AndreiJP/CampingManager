import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [SharedModule],
  template: `
    <app-site-navbar></app-site-navbar>
    <app-content-block 
      title="Chi Siamo" 
      content="<p>Siamo una realtà immersa nel verde, dedicata a chi cerca autenticità...</p>">
    </app-content-block>
    <app-site-footer></app-site-footer>
  `
})
export class AboutPageComponent { }
