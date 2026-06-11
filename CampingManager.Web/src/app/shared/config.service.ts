import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

export interface SiteConfig {
  siteName: string;
  logoIcon: string;
  heroTitle: string;
  address: string;
  email: string;
  phone: string;
  openingHours: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
}

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  private readonly siteConfig: SiteConfig = {
    siteName: "Camping Verde",
    logoIcon: "bi-tree-fill",
    heroTitle: "Piazzole camper e tende nel verde",
    address: "Via dei Boschi 42, 56100 Pisa (PI), Italia",
    email: "info@campingverde.it",
    phone: "+39 050 123456",
    openingHours: "Aperto da Aprile a Ottobre - 08:00 - 22:00",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    twitterUrl: "https://twitter.com",
  };

  readonly config$ = of(this.siteConfig);

  getConfig(): Observable<SiteConfig> {
    return this.config$;
  }
}
