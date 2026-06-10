import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize, timeout } from 'rxjs';
import { ConfirmationService } from '../../../../core/confirmation/confirmation.service';
import { formatApiError } from '../../../../core/http/api-error';
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
    private readonly confirmationService: ConfirmationService,
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
          this.errorMessage = formatApiError(
            error,
            'Impossibile caricare le piazzole. Verifica che API e login siano attivi.',
          );
        },
      });
  }

  deletePitch(pitch: Pitch): void {
    const confirmed = this.confirmationService.confirm(`Eliminare la piazzola ${pitch.pitchNumber}?`);

    if (!confirmed) {
      return;
    }

    this.pitchesService.deletePitch(pitch.id).subscribe({
      next: () => this.loadPitches(this.result?.pageNumber ?? 1),
      error: (error: unknown) => {
        this.errorMessage = formatApiError(error, 'Impossibile eliminare la piazzola.');
        this.changeDetector.markForCheck();
      },
    });
  }
}
