import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SlideshowComponent } from "./slideshow.component";

describe("SlideshowComponent", () => {
  let fixture: ComponentFixture<SlideshowComponent>;
  let component: SlideshowComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideshowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SlideshowComponent);
    component = fixture.componentInstance;
  });

  it("does not change index when the item list is empty", () => {
    component.items = [];

    component.next();
    component.prev();

    expect(component.currentIndex).toBe(0);
  });

  it("moves between slideshow items", () => {
    component.items = [
      { imageUrl: "/one.jpg", title: "Uno", description: "Prima slide" },
      { imageUrl: "/two.jpg", title: "Due", description: "Seconda slide" },
    ];

    component.next();
    expect(component.currentIndex).toBe(1);

    component.next();
    expect(component.currentIndex).toBe(0);

    component.prev();
    expect(component.currentIndex).toBe(1);
  });
});
