import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared-module";
import { ConfigService } from "../../../shared/config.service";

@Component({
  selector: "app-contact-page",
  standalone: true,
  imports: [CommonModule, SharedModule],
  template: `
    <app-site-navbar></app-site-navbar>
    
    <main class="container py-5" *ngIf="config$ | async as config">
      <h1 class="mb-4 text-center">Contattaci</h1>
      
      <div class="row g-5">
        <!-- Info lato sinistro -->
        <div class="col-lg-5">
          <div class="card h-100 p-4 border-0 shadow-sm rounded-4">
            <h3 class="mb-4">Informazioni</h3>
            <p class="text-muted mb-4">Siamo a tua disposizione per qualsiasi domanda o richiesta speciale.</p>
            
            <ul class="list-unstyled">
              <li class="mb-3"><i class="bi bi-geo-alt me-2"></i> {{ config.address }}</li>
              <li class="mb-3"><i class="bi bi-telephone me-2"></i> <a [href]="'tel:' + config.phone">{{ config.phone }}</a></li>
              <li class="mb-3"><i class="bi bi-envelope me-2"></i> <a [href]="'mailto:' + config.email">{{ config.email }}</a></li>
            </ul>
          </div>
        </div>

        <!-- Form lato destro -->
        <div class="col-lg-7">
          <div class="card p-4 border-0 shadow-sm rounded-4">
            <h3 class="mb-4">Inviaci un messaggio</h3>
            <app-contact-form></app-contact-form>
          </div>
        </div>
      </div>
    </main>

    <app-site-footer></app-site-footer>
  `,
  styles: [`
    .rounded-4 { border-radius: 1.5rem !important; }
  `]
})
export class ContactPageComponent {
  private readonly configService = inject(ConfigService);
  readonly config$ = this.configService.config$;
}
