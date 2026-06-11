import { Component, inject, HostListener } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

interface AccommodationOption {
  value: string;
  label: string;
}

export interface CalendarDay {
  date: Date;
  dayNum: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isSelectedCheckIn: boolean;
  isSelectedCheckOut: boolean;
  isInRange: boolean;
}

@Component({
  selector: 'app-availability-booking',
  standalone: false,
  templateUrl: './availability-booking.component.html',
  styleUrl: './availability-booking.component.scss',
})
export class AvailabilityBookingComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly accommodationOptions: AccommodationOption[] = [
    { value: 'all', label: 'Tutte le tipologie' },
    { value: 'camper', label: 'Camper' },
    { value: 'tent', label: 'Tenda' },
    { value: 'caravan', label: 'Roulotte' },
  ];

  readonly availabilityForm = this.formBuilder.nonNullable.group({
    checkInDate: ['', [Validators.required]],
    checkOutDate: ['', [Validators.required]],
    adultsCount: [2, [Validators.required, Validators.min(1), Validators.max(12)]],
    childrenCount: [0, [Validators.required, Validators.min(0), Validators.max(12)]],
    accommodationType: ['all', [Validators.required]],
  });

  readonly bookingForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(80)]],
    lastName: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    phoneNumber: ['', [Validators.required, Validators.maxLength(30)]],
    notes: ['', [Validators.maxLength(500)]],
  });

  readonly minDate = new Date().toISOString().slice(0, 10);
  availabilityChecked = false;
  bookingSubmitted = false;
  errorMessage = '';

  // Dropdown States
  showCheckInCalendar = false;
  showCheckOutCalendar = false;
  showGuestsDropdown = false;
  showAccommodationDropdown = false;

  // UI Experiment: Radio buttons instead of dropdown
  useRadioSelection = false;

  // Calendar Navigation States
  calendarYear = new Date().getFullYear();
  calendarMonth = new Date().getMonth(); // 0-indexed

  readonly monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  readonly weekdayNames = ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'];

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeAllDropdowns();
  }

  closeAllDropdowns(): void {
    this.showCheckInCalendar = false;
    this.showCheckOutCalendar = false;
    this.showGuestsDropdown = false;
    this.showAccommodationDropdown = false;
  }

  toggleCheckInCalendar(event: Event): void {
    event.stopPropagation();
    const open = this.showCheckInCalendar;
    this.closeAllDropdowns();
    this.showCheckInCalendar = !open;
    if (this.showCheckInCalendar) {
      const checkInVal = this.availabilityForm.controls.checkInDate.value;
      const refDate = checkInVal ? new Date(checkInVal) : new Date();
      this.calendarYear = refDate.getFullYear();
      this.calendarMonth = refDate.getMonth();
    }
  }

  toggleCheckOutCalendar(event: Event): void {
    event.stopPropagation();
    const open = this.showCheckOutCalendar;
    this.closeAllDropdowns();
    this.showCheckOutCalendar = !open;
    if (this.showCheckOutCalendar) {
      const checkOutVal = this.availabilityForm.controls.checkOutDate.value;
      const refDate = checkOutVal ? new Date(checkOutVal) : new Date();
      this.calendarYear = refDate.getFullYear();
      this.calendarMonth = refDate.getMonth();
    }
  }

  toggleGuestsDropdown(event: Event): void {
    event.stopPropagation();
    const open = this.showGuestsDropdown;
    this.closeAllDropdowns();
    this.showGuestsDropdown = !open;
  }

  toggleAccommodationDropdown(event: Event): void {
    event.stopPropagation();
    const open = this.showAccommodationDropdown;
    this.closeAllDropdowns();
    this.showAccommodationDropdown = !open;
  }

  changeMonth(amount: number, event: Event): void {
    event.stopPropagation();
    let newMonth = this.calendarMonth + amount;
    let newYear = this.calendarYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    this.calendarYear = newYear;
    this.calendarMonth = newMonth;
  }

  getCalendarDays(): CalendarDay[] {
    const year = this.calendarYear;
    const month = this.calendarMonth;
    const days: CalendarDay[] = [];

    const firstDay = new Date(year, month, 1);
    let startDayOfWeek = firstDay.getDay();
    // Make Monday = 0, Sunday = 6
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkInStr = this.availabilityForm.controls.checkInDate.value;
    const checkOutStr = this.availabilityForm.controls.checkOutDate.value;

    const checkInDate = checkInStr ? new Date(checkInStr) : null;
    if (checkInDate) checkInDate.setHours(0, 0, 0, 0);
    const checkOutDate = checkOutStr ? new Date(checkOutStr) : null;
    if (checkOutDate) checkOutDate.setHours(0, 0, 0, 0);

    // Prev month days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevTotalDays - i);
      days.push(this.createCalendarDay(prevDate, false, today, checkInDate, checkOutDate));
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const currDate = new Date(year, month, i);
      days.push(this.createCalendarDay(currDate, true, today, checkInDate, checkOutDate));
    }

    // Next month days to make 42 cells (6 rows)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push(this.createCalendarDay(nextDate, false, today, checkInDate, checkOutDate));
    }

    return days;
  }

  private createCalendarDay(
    date: Date,
    isCurrentMonth: boolean,
    today: Date,
    checkInDate: Date | null,
    checkOutDate: Date | null
  ): CalendarDay {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const isToday = d.getTime() === today.getTime();
    const isDisabled = d.getTime() < today.getTime();

    const isSelectedCheckIn = checkInDate ? d.getTime() === checkInDate.getTime() : false;
    const isSelectedCheckOut = checkOutDate ? d.getTime() === checkOutDate.getTime() : false;

    const isInRange = checkInDate && checkOutDate
      ? d.getTime() > checkInDate.getTime() && d.getTime() < checkOutDate.getTime()
      : false;

    return {
      date: d,
      dayNum: d.getDate(),
      isCurrentMonth,
      isToday,
      isDisabled,
      isSelectedCheckIn,
      isSelectedCheckOut,
      isInRange,
    };
  }

  selectDate(day: CalendarDay, isCheckIn: boolean, event: Event): void {
    event.stopPropagation();
    if (day.isDisabled) return;

    // Use local date values without timezone shift
    const year = day.date.getFullYear();
    const month = String(day.date.getMonth() + 1).padStart(2, '0');
    const date = String(day.date.getDate()).padStart(2, '0');
    const localISODate = `${year}-${month}-${date}`;

    if (isCheckIn) {
      this.availabilityForm.controls.checkInDate.setValue(localISODate);
      this.showCheckInCalendar = false;

      // Automatically update Check-out date if it is invalid
      const checkOutVal = this.availabilityForm.controls.checkOutDate.value;
      if (!checkOutVal || checkOutVal <= localISODate) {
        const nextDay = new Date(day.date);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextYear = nextDay.getFullYear();
        const nextMonth = String(nextDay.getMonth() + 1).padStart(2, '0');
        const nextDate = String(nextDay.getDate()).padStart(2, '0');
        const nextDayStr = `${nextYear}-${nextMonth}-${nextDate}`;
        this.availabilityForm.controls.checkOutDate.setValue(nextDayStr);
      }
    } else {
      this.availabilityForm.controls.checkOutDate.setValue(localISODate);
      this.showCheckOutCalendar = false;
    }

    this.verifyAvailability();
  }

  incrementAdults(event: Event): void {
    event.stopPropagation();
    const current = this.availabilityForm.controls.adultsCount.value;
    if (current < 12) {
      this.availabilityForm.controls.adultsCount.setValue(current + 1);
    }
  }

  decrementAdults(event: Event): void {
    event.stopPropagation();
    const current = this.availabilityForm.controls.adultsCount.value;
    if (current > 1) {
      this.availabilityForm.controls.adultsCount.setValue(current - 1);
    }
  }

  incrementChildren(event: Event): void {
    event.stopPropagation();
    const current = this.availabilityForm.controls.childrenCount.value;
    if (current < 12) {
      this.availabilityForm.controls.childrenCount.setValue(current + 1);
    }
  }

  decrementChildren(event: Event): void {
    event.stopPropagation();
    const current = this.availabilityForm.controls.childrenCount.value;
    if (current > 0) {
      this.availabilityForm.controls.childrenCount.setValue(current - 1);
    }
  }

  selectAccommodation(value: string, event: Event): void {
    event.stopPropagation();
    this.availabilityForm.controls.accommodationType.setValue(value);
    this.showAccommodationDropdown = false;
  }

  get guestSummary(): string {
    const value = this.availabilityForm.getRawValue();
    const adults = `${value.adultsCount} adult${value.adultsCount === 1 ? 'o' : 'i'}`;
    const children = value.childrenCount > 0 ? `, ${value.childrenCount} bambin${value.childrenCount === 1 ? 'o' : 'i'}` : '';

    return `${adults}${children}`;
  }

  get selectedAccommodationLabel(): string {
    const selectedValue = this.availabilityForm.controls.accommodationType.value;

    return this.accommodationOptions.find((option) => option.value === selectedValue)?.label ?? 'Tutte le tipologie';
  }

  verifyAvailability(): void {
    this.errorMessage = '';
    this.bookingSubmitted = false;
    this.availabilityForm.markAllAsTouched();

    if (this.availabilityForm.invalid) {
      return;
    }

    const { checkInDate, checkOutDate } = this.availabilityForm.getRawValue();

    if (checkInDate >= checkOutDate) {
      this.availabilityChecked = false;
      this.errorMessage = 'La data di check-out deve essere successiva al check-in.';
      return;
    }

    this.availabilityChecked = true;
  }

  submitBooking(): void {
    this.bookingForm.markAllAsTouched();

    if (this.bookingForm.invalid) {
      return;
    }

    this.bookingSubmitted = true;
  }
}
