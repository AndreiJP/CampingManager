import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SaveCustomerRequest } from '../../models/customer.model';
import { CustomersService } from '../../services/customers.service';

@Component({
  selector: 'app-customer-form-page',
  standalone: false,
  templateUrl: './customer-form-page.component.html',
})
export class CustomerFormPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customersService = inject(CustomersService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    phoneNumber: ['', [Validators.maxLength(30)]],
  });

  customerId: number | null = null;
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  get isEditMode(): boolean {
    return this.customerId !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.customerId = idParam ? Number(idParam) : null;

    if (this.customerId !== null) {
      this.loadCustomer(this.customerId);
    }
  }

  save(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const rawValue = this.form.getRawValue();
    const request: SaveCustomerRequest = {
      ...rawValue,
      phoneNumber: rawValue.phoneNumber.trim() || null,
    };
    const saveRequest =
      this.customerId === null
        ? this.customersService.createCustomer(request)
        : this.customersService.updateCustomer(this.customerId, request);

    saveRequest
      .pipe(finalize(() => {
        this.isSaving = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: () => void this.router.navigate(['/customers']),
        error: () => {
          this.errorMessage = 'Impossibile salvare il cliente. Controlla i dati inseriti.';
          this.changeDetector.markForCheck();
        },
      });
  }

  private loadCustomer(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.customersService
      .getCustomer(id)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: (customer) => {
          this.form.patchValue({
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phoneNumber: customer.phoneNumber ?? '',
          });
        },
        error: () => {
          this.errorMessage = 'Cliente non trovato o API non raggiungibile.';
        },
      });
  }
}
