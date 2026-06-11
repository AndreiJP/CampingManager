import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';

@Component({
  selector: 'app-rules-page',
  standalone: true,
  imports: [SharedModule],
  template: `
    <app-site-navbar></app-site-navbar>
    <app-content-block 
      title="Regolamento" 
      content="<ul><li>Rispetta il silenzio dopo le 23:00</li><li>Animali domestici al guinzaglio</li></ul>">
    </app-content-block>
    <app-site-footer></app-site-footer>
  `
})
export class RulesPageComponent { }
