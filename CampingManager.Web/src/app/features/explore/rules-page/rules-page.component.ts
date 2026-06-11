import { Component } from "@angular/core";
import { SharedModule } from "../../../shared/shared-module";

@Component({
  selector: "app-rules-page",
  standalone: true,
  imports: [SharedModule],
  template: `
    <app-site-navbar></app-site-navbar>
    <app-content-block
      title="Regolamento"
      [paragraphs]="paragraphs"
      [items]="items"
    ></app-content-block>
    <app-site-footer></app-site-footer>
  `,
})
export class RulesPageComponent {
  readonly paragraphs = [
    "Queste sono indicazioni provvisorie per la prima versione del sito. Il regolamento definitivo andra collegato ai contenuti ufficiali del campeggio.",
  ];

  readonly items = [
    "Rispetta il silenzio dopo le 23:00",
    "Tieni gli animali domestici al guinzaglio",
    "Mantieni pulita la piazzola",
    "Rispetta gli orari di check-in e check-out",
  ];
}
