import { CommonModule } from "@angular/common";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";

export interface SlideshowItem {
  imageUrl: string;
  title: string;
  description: string;
}

@Component({
  selector: "app-slideshow",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./slideshow.component.html",
  styleUrls: ["./slideshow.component.scss"],
})
export class SlideshowComponent implements OnInit, OnDestroy {
  @Input() items: SlideshowItem[] = [];
  @Input() interval = 5000;

  currentIndex = 0;
  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  startTimer(): void {
    if (this.items.length <= 1) {
      return;
    }

    this.timer = setInterval(() => {
      this.next();
    }, this.interval);
  }

  stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  next(): void {
    if (this.items.length === 0) {
      return;
    }

    this.currentIndex = (this.currentIndex + 1) % this.items.length;
  }

  prev(): void {
    if (this.items.length === 0) {
      return;
    }

    this.currentIndex =
      (this.currentIndex - 1 + this.items.length) % this.items.length;
  }
}
