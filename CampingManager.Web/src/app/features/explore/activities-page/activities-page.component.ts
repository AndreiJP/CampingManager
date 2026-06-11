import { Component } from "@angular/core";
import { SharedModule } from "../../../shared/shared-module";

@Component({
  selector: "app-activities-page",
  standalone: true,
  imports: [SharedModule],
  template: `
    <app-site-navbar></app-site-navbar>
    <app-content-block
      title="Attivita"
      [paragraphs]="paragraphs"
      [items]="items"
    ></app-content-block>
    <app-site-footer></app-site-footer>
  `,
})
export class ActivitiesPageComponent {
  readonly paragraphs = [
    "Il campeggio propone esperienze leggere e adatte a ritmi diversi, pensate per vivere il verde e il territorio.",
  ];

  readonly items = [
    "Passeggiate e trekking nei dintorni",
    "Noleggio bici",
    "Attivita per famiglie",
    "Momenti di relax all aperto",
  ];
}
