import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared-module";

@Component({
  selector: "app-activities-page",
  standalone: true,
  imports: [CommonModule, SharedModule],
  template: `
    <app-site-navbar></app-site-navbar>
    
    <main class="container py-5">
      <h1 class="mb-5 text-center">{{ "NAVBAR.ACTIVITIES" | translate }}</h1>
      <div class="row g-4">
        <div class="col-12" *ngFor="let act of activities">
          <div class="activity-row rounded-4 overflow-hidden shadow-sm d-flex">
            <div class="activity-img" [style.background-image]="'url(' + act.img + ')'"></div>
            <div class="card-body p-4 bg-white d-flex align-items-center">
              <div class="icon-wrap me-4">
                <i class="bi {{ act.icon }} fs-2"></i>
              </div>
              <div>
                <h3 class="mb-1">{{ act.title | translate }}</h3>
                <p class="mb-0 text-muted">{{ act.desc | translate }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <app-site-footer></app-site-footer>
  `,
  styles: [`
    .rounded-4 { border-radius: 1.5rem !important; }
    .activity-row { min-height: 200px; transition: transform 0.3s ease; }
    .activity-row:hover { transform: translateY(-5px); }
    .activity-img { width: 300px; background-size: cover; background-position: center; flex-shrink: 0; }
    .icon-wrap { color: var(--site-green); width: 60px; text-align: center; }
  `]
})
export class ActivitiesPageComponent {
  readonly activities = [
    { title: "ACTIVITIES.TREKKING.TITLE", desc: "ACTIVITIES.TREKKING.DESC", icon: "bi-tree", img: "https://picsum.photos/400/250?nature=1" },
    { title: "ACTIVITIES.BIKE.TITLE", desc: "ACTIVITIES.BIKE.DESC", icon: "bi-bicycle", img: "https://picsum.photos/400/250?nature=2" },
    { title: "ACTIVITIES.FAMILY.TITLE", desc: "ACTIVITIES.FAMILY.DESC", icon: "bi-people", img: "https://picsum.photos/400/250?nature=3" },
    { title: "ACTIVITIES.RELAX.TITLE", desc: "ACTIVITIES.RELAX.DESC", icon: "bi-cloud-sun", img: "https://picsum.photos/400/250?nature=4" }
  ];
}
