import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, catchError, of } from 'rxjs';

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
  providedIn: 'root',
})
export class ConfigService {
  private readonly http = inject(HttpClient);
  
  // Default values to fallback on if the API is offline
  private readonly defaultConfig: SiteConfig = {
    siteName: 'Camping Verde',
    logoIcon: 'bi-tree-fill',
    heroTitle: 'Piazzole camper e tende nel verde',
    address: 'Via dei Boschi 42, 56100 Pisa (PI), Italia',
    email: 'info@campingverde.it',
    phone: '+39 050 123456',
    openingHours: 'Aperto da Aprile a Ottobre - 08:00 - 22:00',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    twitterUrl: 'https://twitter.com',
  };

  private readonly configUrl = 'http://localhost:5117/api/config';

  readonly config$ = this.http.get<SiteConfig>(this.configUrl).pipe(
    map((apiConfig) => {
      // Map C# PascalCase (or standard camelCase) to the local interface
      return {
        siteName: apiConfig.siteName || (apiConfig as any).SiteName || this.defaultConfig.siteName,
        logoIcon: apiConfig.logoIcon || (apiConfig as any).LogoIcon || this.defaultConfig.logoIcon,
        heroTitle: apiConfig.heroTitle || (apiConfig as any).HeroTitle || this.defaultConfig.heroTitle,
        address: apiConfig.address || (apiConfig as any).Address || this.defaultConfig.address,
        email: apiConfig.email || (apiConfig as any).Email || this.defaultConfig.email,
        phone: apiConfig.phone || (apiConfig as any).Phone || this.defaultConfig.phone,
        openingHours: apiConfig.openingHours || (apiConfig as any).OpeningHours || this.defaultConfig.openingHours,
        facebookUrl: apiConfig.facebookUrl || (apiConfig as any).FacebookUrl || this.defaultConfig.facebookUrl,
        instagramUrl: apiConfig.instagramUrl || (apiConfig as any).InstagramUrl || this.defaultConfig.instagramUrl,
        twitterUrl: apiConfig.twitterUrl || (apiConfig as any).TwitterUrl || this.defaultConfig.twitterUrl,
      };
    }),
    catchError(() => {
      // Return local defaults in case of network/connection error
      return of(this.defaultConfig);
    }),
    shareReplay(1)
  );

  getConfig(): Observable<SiteConfig> {
    return this.config$;
  }
}
