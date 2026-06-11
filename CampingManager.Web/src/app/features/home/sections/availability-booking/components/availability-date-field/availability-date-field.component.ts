import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import type { CalendarDay } from "../../availability-booking.component";

@Component({
  selector: "app-availability-date-field",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./availability-date-field.component.html",
  styleUrl: "./availability-date-field.component.scss",
})
export class AvailabilityDateFieldComponent {
  @Input() label = "";
  @Input() value = "";
  @Input() isOpen = false;
  @Input() hasError = false;
  @Input() monthName = "";
  @Input() year = new Date().getFullYear();
  @Input() weekdayNames: string[] = [];
  @Input() days: CalendarDay[] = [];
  @Input() selectedClass: "isSelectedCheckIn" | "isSelectedCheckOut" =
    "isSelectedCheckIn";

  @Output() toggle = new EventEmitter<void>();
  @Output() monthChange = new EventEmitter<number>();
  @Output() daySelected = new EventEmitter<CalendarDay>();

  toggleCalendar(event: Event): void {
    event.stopPropagation();
    this.toggle.emit();
  }

  changeMonth(amount: number, event: Event): void {
    event.stopPropagation();
    this.monthChange.emit(amount);
  }

  selectDay(day: CalendarDay, event: Event): void {
    event.stopPropagation();
    this.daySelected.emit(day);
  }
}
