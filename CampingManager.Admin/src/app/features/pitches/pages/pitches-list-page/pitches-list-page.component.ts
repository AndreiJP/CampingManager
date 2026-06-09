import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, timeout } from 'rxjs';
import { PagedResult } from '../../../../shared/models/paged-result';
import { Pitch } from '../../models/pitch.model';
import { PitchesService } from '../../services/pitches.service';

@Component({
  selector: 'app-pitches-list-page',
  standalone: false,
  templateUrl: './pitches-list-page.component.html',
})
export class PitchesListPageComponent implements OnInit {
  result: PagedResult<Pitch> | null = null;
  search = '';
  isActive = '';
  isLoading = false;
  errorMessage = '';
  readonly pageSize = 20;

  constructor(
    private readonly pitchesService: PitchesService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadPitches();
  }

  loadPitches(pageNumber = 1): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.pitchesService
      .getPitches({
        pageNumber,
        pageSize: this.pageSize,
        search: this.search.trim() || undefined,
        isActive: this.isActive === '' ? undefined : this.isActive === 'true',
      })
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isLoading = false;
          this.changeDetector.markForCheck();
        })
      )
      .subscribe({
        next: (result) => {
          this.result = result;
        },
        error: (error: unknown) => {
          console.error('Pitches list load failed', error);
          const status = error instanceof HttpErrorResponse ? ` Stato HTTP: ${error.status}.` : '';

          this.errorMessage = `Impossibile caricare le piazzole.${status} Verifica che API e login siano attivi.`;
        },
      });
  }

  deletePitch(pitch: Pitch): void {
    const confirmed = window.confirm(`Eliminare la piazzola ${pitch.pitchNumber}?`);

    if (!confirmed) {
      return;
    }

    this.pitchesService.deletePitch(pitch.id).subscribe({
      next: () => this.loadPitches(this.result?.pageNumber ?? 1),
      error: () => {
        this.errorMessage = 'Impossibile eliminare la piazzola.';
        this.changeDetector.markForCheck();
      },
    });
  }
}
