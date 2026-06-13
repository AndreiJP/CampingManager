import { registerLocaleData } from "@angular/common";
import { HttpClient, provideHttpClient } from "@angular/common/http";
import localeIt from "@angular/common/locales/it";
import {
  LOCALE_ID,
  NgModule,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { provideTranslateService, provideTranslateLoader, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader, provideTranslateHttpLoader } from "@ngx-translate/http-loader";

import { AppRoutingModule } from "./app-routing-module";
import { App } from "./app";

registerLocaleData(localeIt, "it-IT");

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideTranslateService({
      lang: "it",
      loader: provideTranslateLoader(TranslateHttpLoader),
    }),
    provideTranslateHttpLoader({
      prefix: "./assets/i18n/",
      suffix: ".json",
    }),
    { provide: LOCALE_ID, useValue: "it-IT" },
  ],
  bootstrap: [App],
})
export class AppModule {}
