import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize, timeout } from 'rxjs';
import { PagedResult } from '../../../../shared/models/paged-result';
import { Customer } from '../../models/customer.model';
import { CustomersService } from '../../services/customers.service';

@Component({
  selector: 'app-customers-list-page',
  standalone: false,
  templateUrl: './customers-list-page.component.html',
})
export class CustomersListPageComponent implements OnInit {
  result: PagedResult<Customer> | null = null;
  search = '';
  isLoading = false;
  errorMessage = '';
  readonly pageSize = 20;

  constructor(
    private readonly customersService: CustomersService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(pageNumber = 1): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.customersService
      .getCustomers({
        pageNumber,
        pageSize: this.pageSize,
        search: this.search.trim() || undefined,
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
          this.errorMessage = 'Impossibile caricare i clienti. Verifica che API e login siano attivi.';
        },
      });
  }

  deleteCustomer(customer: Customer): void {
    const confirmed = window.confirm(`Eliminare il cliente ${customer.firstName} ${customer.lastName}?`);

    if (!confirmed) {
      return;
    }

    this.customersService.deleteCustomer(customer.id).subscribe({
      next: () => this.loadCustomers(this.result?.pageNumber ?? 1),
      error: () => {
        this.errorMessage = 'Impossibile eliminare il cliente.';
        this.changeDetector.markForCheck();
      },
    });
  }
}
