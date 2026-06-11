import { Component } from "@angular/core";
import { SharedModule } from "../../../shared/shared-module";

@Component({
  selector: "app-contact-page",
  standalone: true,
  imports: [SharedModule],
  template: `
    <app-site-navbar></app-site-navbar>
    <app-content-block
      title="Contattaci"
      [paragraphs]="paragraphs"
    ></app-content-block>
    <app-contact-form></app-contact-form>
    <app-site-footer></app-site-footer>
  `,
})
export class ContactPageComponent {
  readonly paragraphs = [
    "Siamo a tua disposizione per informazioni su disponibilita, servizi e richieste particolari.",
  ];
}
