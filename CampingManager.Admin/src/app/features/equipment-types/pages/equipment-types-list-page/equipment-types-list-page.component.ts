import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize, timeout } from 'rxjs';
import { PagedResult } from '../../../../shared/models/paged-result';
import { EquipmentType } from '../../models/equipment-type.model';
import { EquipmentTypesService } from '../../services/equipment-types.service';

@Component({
  selector: 'app-equipment-types-list-page',
  standalone: false,
  templateUrl: './equipment-types-list-page.component.html',
})
export class EquipmentTypesListPageComponent implements OnInit {
  result: PagedResult<EquipmentType> | null = null;
  search = '';
  isActive = '';
  isLoading = false;
  errorMessage = '';
  readonly pageSize = 20;

  constructor(
    private readonly equipmentTypesService: EquipmentTypesService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadEquipmentTypes();
  }

  loadEquipmentTypes(pageNumber = 1): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.equipmentTypesService
      .getEquipmentTypes({
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
        error: () => {
          this.errorMessage = 'Impossibile caricare le tipologie. Verifica che API e login siano attivi.';
        },
      });
  }

  deleteEquipmentType(type: EquipmentType): void {
    const confirmed = window.confirm(`Eliminare la tipologia ${type.code}?`);

    if (!confirmed) {
      return;
    }

    this.equipmentTypesService.deleteEquipmentType(type.id).subscribe({
      next: () => this.loadEquipmentTypes(this.result?.pageNumber ?? 1),
      error: () => {
        this.errorMessage = 'Impossibile eliminare la tipologia.';
        this.changeDetector.markForCheck();
      },
    });
  }
}
