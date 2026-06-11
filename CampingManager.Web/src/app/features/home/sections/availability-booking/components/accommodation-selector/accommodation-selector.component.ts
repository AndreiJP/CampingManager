import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import type { AccommodationOption } from "../../availability-booking.component";

@Component({
  selector: "app-accommodation-selector",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./accommodation-selector.component.html",
  styleUrl: "./accommodation-selector.component.scss",
})
export class AccommodationSelectorComponent {
  @Input() isOpen = false;
  @Input() selectedValue = "";
  @Input() selectedLabel = "";
  @Input() options: AccommodationOption[] = [];

  @Output() toggle = new EventEmitter<void>();
  @Output() optionSelected = new EventEmitter<string>();

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.toggle.emit();
  }

  selectOption(value: string, event: Event): void {
    event.stopPropagation();
    this.optionSelected.emit(value);
  }
}
