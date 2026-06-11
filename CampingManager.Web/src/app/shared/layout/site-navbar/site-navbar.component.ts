import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ConfigService } from "../../config.service";

@Component({
  selector: "app-site-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./site-navbar.component.html",
  styleUrl: "./site-navbar.component.scss",
})
export class SiteNavbarComponent {
  private readonly configService = inject(ConfigService);
  readonly config$ = this.configService.config$;
}
