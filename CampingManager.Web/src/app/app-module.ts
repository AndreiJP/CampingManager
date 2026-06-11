import { registerLocaleData } from "@angular/common";
import localeIt from "@angular/common/locales/it";
import {
  LOCALE_ID,
  NgModule,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing-module";
import { App } from "./app";

registerLocaleData(localeIt, "it-IT");

@NgModule({
  declarations: [App],
  imports: [BrowserModule, AppRoutingModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: LOCALE_ID, useValue: "it-IT" },
  ],
  bootstrap: [App],
})
export class AppModule {}
