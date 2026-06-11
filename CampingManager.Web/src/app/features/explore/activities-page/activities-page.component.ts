import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';

@Component({
  selector: 'app-activities-page',
  standalone: true,
  imports: [SharedModule],
  template: `
    <app-site-navbar></app-site-navbar>
    <app-content-block 
      title="Attività" 
      content="<p>Trekking, yoga al mattino, noleggio bici e molto altro...</p>">
    </app-content-block>
    <app-site-footer></app-site-footer>
  `
})
export class ActivitiesPageComponent { }
