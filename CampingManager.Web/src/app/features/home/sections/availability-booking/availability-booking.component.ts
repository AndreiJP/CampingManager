import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

interface AccommodationOption {
  value: string;
  label: string;
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
