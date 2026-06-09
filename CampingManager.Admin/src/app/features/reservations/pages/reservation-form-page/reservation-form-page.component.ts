import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { Customer } from '../../../customers/models/customer.model';
import { CustomersService } from '../../../customers/services/customers.service';
import { EquipmentType } from '../../../equipment-types/models/equipment-type.model';
import { EquipmentTypesService } from '../../../equipment-types/services/equipment-types.service';
import { Pitch } from '../../../pitches/models/pitch.model';
import { PitchesService } from '../../../pitches/services/pitches.service';
import { ReservationStatus, SaveReservationRequest } from '../../models/reservation.model';
import { ReservationsService } from '../../services/reservations.service';

@Component({
  selector: 'app-reservation-form-page',
  standalone: false,
  templateUrl: './reservation-form-page.component.html',
})
export class ReservationFormPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customersService = inject(CustomersService);
  private readonly pitchesService = inject(PitchesService);
  private readonly equipmentTypesService = inject(EquipmentTypesService);
  private readonly reservationsService = inject(ReservationsService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  readonly statuses: ReservationStatus[] = ['Pending', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled', 'NoShow'];
  readonly form = this.formBuilder.nonNullable.group({
    reservationCode: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[A-Za-z0-9-]+$/)]],
    customerId: [0, [Validators.required, Validators.min(1)]],
    pitchId: [0, [Validators.required, Validators.min(1)]],
    campingEquipmentTypeId: [0, [Validators.required, Validators.min(1)]],
    checkInDate: ['', [Validators.required]],
    checkOutDate: ['', [Validators.required]],
    adultsCount: [1, [Validators.required, Validators.min(1), Validators.max(50)]],
    childrenCount: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
    petsCount: [0, [Validators.required, Validators.min(0), Validators.max(20)]],
    vehiclePlate: ['', [Validators.maxLength(20), Validators.pattern(/^[A-Za-z0-9 -]*$/)]],
    status: ['Pending' as ReservationStatus, [Validators.required]],
    notes: ['', [Validators.maxLength(1000)]],
  });

  reservationId: number | null = null;
  customers: Customer[] = [];
  pitches: Pitch[] = [];
  equipmentTypes: EquipmentType[] = [];
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  get isEditMode(): boolean {
    return this.reservationId !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.reservationId = idParam ? Number(idParam) : null;
    this.loadInitialData();
  }

  save(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.isSaving) {
      return;
    }

    const rawValue = this.form.getRawValue();

    if (rawValue.checkInDate >= rawValue.checkOutDate) {
      this.errorMessage = 'La data di check-out deve essere successiva al check-in.';
      this.changeDetector.markForCheck();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const request: SaveReservationRequest = {
      ...rawValue,
      vehiclePlate: rawValue.vehiclePlate.trim() || null,
      notes: rawValue.notes.trim() || null,
    };
    const saveRequest =
      this.reservationId === null
        ? this.reservationsService.createReservation(request)
        : this.reservationsService.updateReservation(this.reservationId, request);

    saveRequest
      .pipe(finalize(() => {
        this.isSaving = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: () => void this.router.navigate(['/reservations']),
        error: () => {
          this.errorMessage = 'Impossibile salvare la prenotazione. Controlla disponibilita e dati inseriti.';
          this.changeDetector.markForCheck();
        },
      });
  }

  private loadInitialData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const lookupRequests = {
      customers: this.customersService.getCustomers({ pageNumber: 1, pageSize: 100 }),
      pitches: this.pitchesService.getPitches({ pageNumber: 1, pageSize: 100 }),
      equipmentTypes: this.equipmentTypesService.getEquipmentTypes({ pageNumber: 1, pageSize: 100 }),
    };
    const requests =
      this.reservationId === null
        ? lookupRequests
        : {
            ...lookupRequests,
            reservation: this.reservationsService.getReservation(this.reservationId),
          };

    forkJoin(requests)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: (result) => {
          this.customers = result.customers.items;
          this.pitches = result.pitches.items;
          this.equipmentTypes = result.equipmentTypes.items;

          if ('reservation' in result) {
            const reservation = result.reservation;
            this.form.patchValue({
              reservationCode: reservation.reservationCode,
              customerId: reservation.customerId,
              pitchId: reservation.pitchId,
              campingEquipmentTypeId: reservation.campingEquipmentTypeId,
              checkInDate: reservation.checkInDate.slice(0, 10),
              checkOutDate: reservation.checkOutDate.slice(0, 10),
              adultsCount: reservation.adultsCount,
              childrenCount: reservation.childrenCount,
              petsCount: reservation.petsCount,
              vehiclePlate: reservation.vehiclePlate ?? '',
              status: reservation.status,
              notes: reservation.notes ?? '',
            });
          }
        },
        error: () => {
          this.errorMessage = 'Impossibile caricare i dati necessari alla prenotazione.';
        },
      });
  }
}
