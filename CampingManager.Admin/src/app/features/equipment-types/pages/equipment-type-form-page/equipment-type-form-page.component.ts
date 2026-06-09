import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SaveEquipmentTypeRequest } from '../../models/equipment-type.model';
import { EquipmentTypesService } from '../../services/equipment-types.service';

@Component({
  selector: 'app-equipment-type-form-page',
  standalone: false,
  templateUrl: './equipment-type-form-page.component.html',
})
export class EquipmentTypeFormPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly equipmentTypesService = inject(EquipmentTypesService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  readonly form = this.formBuilder.nonNullable.group({
    code: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[A-Za-z0-9-]+$/)]],
    name: ['', [Validators.required, Validators.maxLength(100)]],
    isActive: [true],
  });

  equipmentTypeId: number | null = null;
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  get isEditMode(): boolean {
    return this.equipmentTypeId !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.equipmentTypeId = idParam ? Number(idParam) : null;

    if (this.equipmentTypeId !== null) {
      this.loadEquipmentType(this.equipmentTypeId);
    }
  }

  save(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const request: SaveEquipmentTypeRequest = this.form.getRawValue();
    const saveRequest =
      this.equipmentTypeId === null
        ? this.equipmentTypesService.createEquipmentType(request)
        : this.equipmentTypesService.updateEquipmentType(this.equipmentTypeId, request);

    saveRequest
      .pipe(finalize(() => {
        this.isSaving = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: () => void this.router.navigate(['/equipment-types']),
        error: () => {
          this.errorMessage = 'Impossibile salvare la tipologia. Controlla i dati inseriti.';
          this.changeDetector.markForCheck();
        },
      });
  }

  private loadEquipmentType(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.equipmentTypesService
      .getEquipmentType(id)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: (type) => {
          this.form.patchValue({
            code: type.code,
            name: type.name,
            isActive: type.isActive,
          });
        },
        error: () => {
          this.errorMessage = 'Tipologia non trovata o API non raggiungibile.';
        },
      });
  }
}
