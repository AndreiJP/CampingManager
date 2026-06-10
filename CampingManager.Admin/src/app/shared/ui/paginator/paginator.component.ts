import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PagedResult } from '../../models/paged-result';

@Component({
  selector: 'app-paginator',
  standalone: false,
  templateUrl: './paginator.component.html',
})
export class PaginatorComponent {
  @Input() result: PagedResult<unknown> | null = null;
  @Output() readonly pageChange = new EventEmitter<number>();

  get canShow(): boolean {
    return !!this.result && this.result.totalPages > 1;
  }

  goToPage(pageNumber: number): void {
    if (!this.result || pageNumber < 1 || pageNumber > this.result.totalPages) {
      return;
    }

    this.pageChange.emit(pageNumber);
  }
}
