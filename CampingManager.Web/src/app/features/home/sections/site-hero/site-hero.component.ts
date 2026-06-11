import { Component, inject } from "@angular/core";
import { ConfigService } from "../../../../shared/config.service";

@Component({
  selector: "app-site-hero",
  standalone: false,
  templateUrl: "./site-hero.component.html",
  styleUrl: "./site-hero.component.scss",
})
export class SiteHeroComponent {
  private readonly configService = inject(ConfigService);
  readonly config$ = this.configService.config$;
}
