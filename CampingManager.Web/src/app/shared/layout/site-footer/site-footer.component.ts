import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { ConfigService } from "../../config.service";

@Component({
  selector: "app-site-footer",
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: "./site-footer.component.html",
  styleUrl: "./site-footer.component.scss",
})
export class SiteFooterComponent {
  private readonly configService = inject(ConfigService);
  readonly config$ = this.configService.config$;

  readonly currentYear = new Date().getFullYear();
}
