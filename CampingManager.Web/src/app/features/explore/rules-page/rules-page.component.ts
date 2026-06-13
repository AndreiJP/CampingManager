import { Component } from "@angular/core";
import { SharedModule } from "../../../shared/shared-module";

@Component({
  selector: "app-rules-page",
  standalone: true,
  imports: [SharedModule],
  template: `
    <app-site-navbar></app-site-navbar>
    <main class="container py-5">
      <div class="card p-4 p-md-5 border-0 shadow-sm rounded-4">
        <h1 class="mb-4">{{ "NAVBAR.RULES" | translate }}</h1>
        <p class="text-muted">{{ "RULES.INTRO" | translate }}</p>
        <ol class="list-group list-group-numbered border-0">
          <li *ngFor="let item of items" class="list-group-item border-0">{{ item | translate }}</li>
        </ol>
      </div>
    </main>
    <app-site-footer></app-site-footer>
  `,
  styles: [`.rounded-4 { border-radius: 1.5rem !important; }`]
})
export class RulesPageComponent {
  readonly items = [
    "RULES.ITEM1",
    "RULES.ITEM2",
    "RULES.ITEM3",
    "RULES.ITEM4"
  ];
}
