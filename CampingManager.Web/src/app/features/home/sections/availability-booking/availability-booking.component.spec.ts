import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "../../../../shared/shared-module";
import { AvailabilityBookingComponent } from "./availability-booking.component";
import { AccommodationSelectorComponent } from "./components/accommodation-selector/accommodation-selector.component";
import { AvailabilityDateFieldComponent } from "./components/availability-date-field/availability-date-field.component";
import { GuestSelectorComponent } from "./components/guest-selector/guest-selector.component";

describe("AvailabilityBookingComponent", () => {
  let fixture: ComponentFixture<AvailabilityBookingComponent>;
  let component: AvailabilityBookingComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvailabilityBookingComponent],
      imports: [
        SharedModule,
        AccommodationSelectorComponent,
        AvailabilityDateFieldComponent,
        GuestSelectorComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AvailabilityBookingComponent);
    component = fixture.componentInstance;
  });

  it("shows an error when checkout is not after checkin", () => {
    component.stayDetailsForm.patchValue({
      checkInDate: "2026-07-10",
      checkOutDate: "2026-07-10",
      adultsCount: 2,
      childrenCount: 0,
      accommodationType: "camper",
    });

    component.continueToRequest();

    expect(component.stayDetailsCompleted).toBe(false);
    expect(component.errorMessage).toContain("check-out");
  });

  it("opens the request form with valid stay details", () => {
    component.stayDetailsForm.patchValue({
      checkInDate: "2026-07-10",
      checkOutDate: "2026-07-14",
      adultsCount: 2,
      childrenCount: 1,
      accommodationType: "camper",
    });

    component.continueToRequest();

    expect(component.stayDetailsCompleted).toBe(true);
    expect(component.errorMessage).toBe("");
    expect(component.guestSummary).toBe("2 adulti, 1 bambino");
  });

  it("selects a check-in date and moves checkout to the next day when needed", () => {
    component.selectDate(
      {
        date: new Date(2026, 6, 10),
        dayNum: 10,
        isCurrentMonth: true,
        isToday: false,
        isDisabled: false,
        isSelectedCheckIn: false,
        isSelectedCheckOut: false,
        isInRange: false,
      },
      true,
    );

    expect(component.stayDetailsForm.controls.checkInDate.value).toBe(
      "2026-07-10",
    );
    expect(component.stayDetailsForm.controls.checkOutDate.value).toBe(
      "2026-07-11",
    );
    expect(component.stayDetailsCompleted).toBe(false);
  });

  it("keeps guest counters within their limits", () => {
    component.decrementAdults();
    component.decrementAdults();

    for (let index = 0; index < 20; index++) {
      component.incrementChildren();
    }

    expect(component.stayDetailsForm.controls.adultsCount.value).toBe(1);
    expect(component.stayDetailsForm.controls.childrenCount.value).toBe(12);
  });

  it("does not submit the booking request when required fields are missing", () => {
    component.submitBooking();

    expect(component.bookingSubmitted).toBe(false);
    expect(component.bookingForm.invalid).toBe(true);
  });

  it("marks the booking as submitted when the request form is valid", () => {
    component.bookingForm.patchValue({
      firstName: "Mario",
      lastName: "Rossi",
      email: "mario.rossi@example.com",
      phoneNumber: "3331234567",
      notes: "",
    });

    component.submitBooking();

    expect(component.bookingSubmitted).toBe(true);
  });
});
