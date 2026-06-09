import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SavePitchRequest } from '../../models/pitch.model';
import { PitchesService } from '../../services/pitches.service';

@Component({
  selector: 'app-pitch-form-page',
  standalone: false,
  templateUrl: './pitch-form-page.component.html',
})
export class PitchFormPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pitchesService = inject(PitchesService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  readonly form = this.formBuilder.nonNullable.group({
    pitchNumber: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[A-Za-z0-9-]+$/)]],
    pitchName: ['', [Validators.required, Validators.maxLength(100)]],
    isActive: [true],
  });

  pitchId: number | null = null;
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  get isEditMode(): boolean {
    return this.pitchId !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.pitchId = idParam ? Number(idParam) : null;

    if (this.pitchId !== null) {
      this.loadPitch(this.pitchId);
    }
  }

  save(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const request: SavePitchRequest = this.form.getRawValue();
    const saveRequest =
      this.pitchId === null
        ? this.pitchesService.createPitch(request)
        : this.pitchesService.updatePitch(this.pitchId, request);

    saveRequest
      .pipe(finalize(() => {
        this.isSaving = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: () => void this.router.navigate(['/pitches']),
        error: () => {
          this.errorMessage = 'Impossibile salvare la piazzola. Controlla i dati inseriti.';
          this.changeDetector.markForCheck();
        },
      });
  }

  private loadPitch(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.pitchesService
      .getPitch(id)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: (pitch) => {
          this.form.patchValue({
            pitchNumber: pitch.pitchNumber,
            pitchName: pitch.pitchName,
            isActive: pitch.isActive,
          });
        },
        error: () => {
          this.errorMessage = 'Piazzola non trovata o API non raggiungibile.';
        },
      });
  }
}
