import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, HostListener } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { ConfigService } from "../../config.service";

@Component({
  selector: "app-site-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: "./site-navbar.component.html",
  styleUrl: "./site-navbar.component.scss",
})
export class SiteNavbarComponent implements OnInit {
  private readonly configService = inject(ConfigService);
  private readonly translate = inject(TranslateService);

  readonly config$ = this.configService.config$;
  currentLang = "it";
  showDropdown = false;

  ngOnInit(): void {
    const savedLang = localStorage.getItem("lang") || "it";
    this.currentLang = savedLang;
    this.translate.use(savedLang);
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  changeLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem("lang", lang);
    this.showDropdown = false;
  }

  @HostListener("document:click")
  closeDropdown(): void {
    this.showDropdown = false;
  }
}
