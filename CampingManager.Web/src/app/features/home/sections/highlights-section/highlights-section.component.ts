import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-highlights-section",
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: "./highlights-section.component.html",
  styleUrl: "./highlights-section.component.scss",
})
export class HighlightsSectionComponent {
  highlights = [
    { icon: "bi-wifi", title: "HIGHLIGHTS.WIFI.TITLE", desc: "HIGHLIGHTS.WIFI.DESC" },
    { icon: "bi-water", title: "HIGHLIGHTS.SERVICES.TITLE", desc: "HIGHLIGHTS.SERVICES.DESC" },
    { icon: "bi-lightning-charge", title: "HIGHLIGHTS.POWER.TITLE", desc: "HIGHLIGHTS.POWER.DESC" },
    { icon: "bi-fire", title: "HIGHLIGHTS.BBQ.TITLE", desc: "HIGHLIGHTS.BBQ.DESC" },
    { icon: "bi-house-heart", title: "HIGHLIGHTS.PETS.TITLE", desc: "HIGHLIGHTS.PETS.DESC" }
  ];
}
