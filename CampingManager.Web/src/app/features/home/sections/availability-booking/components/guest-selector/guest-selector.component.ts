import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-guest-selector",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./guest-selector.component.html",
  styleUrl: "./guest-selector.component.scss",
})
export class GuestSelectorComponent {
  @Input() isOpen = false;
  @Input() summary = "";
  @Input() adultsCount = 1;
  @Input() childrenCount = 0;

  @Output() toggle = new EventEmitter<void>();
  @Output() incrementAdults = new EventEmitter<void>();
  @Output() decrementAdults = new EventEmitter<void>();
  @Output() incrementChildren = new EventEmitter<void>();
  @Output() decrementChildren = new EventEmitter<void>();

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.toggle.emit();
  }

  emitClick(event: Event, output: EventEmitter<void>): void {
    event.stopPropagation();
    output.emit();
  }
}
