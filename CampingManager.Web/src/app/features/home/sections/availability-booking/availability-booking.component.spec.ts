import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../../../shared/shared-module';
import { AvailabilityBookingComponent } from './availability-booking.component';

describe('AvailabilityBookingComponent', () => {
  let fixture: ComponentFixture<AvailabilityBookingComponent>;
  let component: AvailabilityBookingComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvailabilityBookingComponent],
      imports: [SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AvailabilityBookingComponent);
    component = fixture.componentInstance;
  });

  it('shows an error when checkout is not after checkin', () => {
    component.availabilityForm.patchValue({
      checkInDate: '2026-07-10',
      checkOutDate: '2026-07-10',
      adultsCount: 2,
      childrenCount: 0,
      accommodationType: 'camper',
    });

    component.verifyAvailability();

    expect(component.availabilityChecked).toBe(false);
    expect(component.errorMessage).toContain('check-out');
  });

  it('marks availability as checked with a valid search', () => {
    component.availabilityForm.patchValue({
      checkInDate: '2026-07-10',
      checkOutDate: '2026-07-14',
      adultsCount: 2,
      childrenCount: 1,
      accommodationType: 'camper',
    });

    component.verifyAvailability();

    expect(component.availabilityChecked).toBe(true);
    expect(component.errorMessage).toBe('');
    expect(component.guestSummary).toBe('2 adulti, 1 bambino');
  });

  it('marks the booking as submitted when the request form is valid', () => {
    component.bookingForm.patchValue({
      firstName: 'Mario',
      lastName: 'Rossi',
      email: 'mario.rossi@example.com',
      phoneNumber: '3331234567',
      notes: '',
    });

    component.submitBooking();

    expect(component.bookingSubmitted).toBe(true);
  });
});
