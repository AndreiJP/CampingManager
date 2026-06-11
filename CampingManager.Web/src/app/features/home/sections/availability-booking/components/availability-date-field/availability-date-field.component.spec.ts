import { registerLocaleData } from "@angular/common";
import localeIt from "@angular/common/locales/it";
import { LOCALE_ID } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AvailabilityDateFieldComponent } from "./availability-date-field.component";

registerLocaleData(localeIt, "it-IT");

describe("AvailabilityDateFieldComponent", () => {
  let fixture: ComponentFixture<AvailabilityDateFieldComponent>;
  let component: AvailabilityDateFieldComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityDateFieldComponent],
      providers: [{ provide: LOCALE_ID, useValue: "it-IT" }],
    }).compileComponents();

    fixture = TestBed.createComponent(AvailabilityDateFieldComponent);
    component = fixture.componentInstance;
  });

  it("formats the selected date with Italian month abbreviations", () => {
    component.label = "Check-in";
    component.value = "2026-06-11";

    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent as string;

    expect(textContent).toContain("11 giu 2026");
  });
});
