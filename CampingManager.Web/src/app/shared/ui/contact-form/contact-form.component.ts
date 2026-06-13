import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: "app-contact-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
      <form
        class="contact-form"
        [formGroup]="form"
        (ngSubmit)="submit()"
        novalidate
      >
        <div class="mb-3">
          <label class="form-label" for="contactName">Nome</label>
          <input
            id="contactName"
            type="text"
            class="form-control"
            formControlName="name"
            [class.is-invalid]="
              form.controls.name.touched && form.controls.name.invalid
            "
          />
          <div class="invalid-feedback">Nome obbligatorio.</div>
        </div>

        <div class="mb-3">
          <label class="form-label" for="contactEmail">Email</label>
          <input
            id="contactEmail"
            type="email"
            class="form-control"
            formControlName="email"
            [class.is-invalid]="
              form.controls.email.touched && form.controls.email.invalid
            "
          />
          <div class="invalid-feedback">Inserisci una email valida.</div>
        </div>

        <div class="mb-3">
          <label class="form-label" for="contactMessage">Messaggio</label>
          <textarea
            id="contactMessage"
            class="form-control"
            rows="4"
            formControlName="message"
            [class.is-invalid]="
              form.controls.message.touched && form.controls.message.invalid
            "
          ></textarea>
          <div class="invalid-feedback">Messaggio obbligatorio.</div>
        </div>

        <div class="alert alert-success" *ngIf="submitted">
          Messaggio preparato in bozza. L'invio email/API verra collegato in uno
          step dedicato.
        </div>

        <button type="submit" class="btn contact-submit w-100">
          Prepara richiesta
        </button>
      </form>
  `,
  styles: [
    `
      .contact-submit {
        background: var(--site-green);
        color: #fff;
        font-weight: 700;
        border: 0;
      }

      .contact-submit:hover {
        background: var(--site-green-soft);
        color: #fff;
      }
    `,
  ],
})
export class ContactFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    name: ["", [Validators.required, Validators.maxLength(80)]],
    email: [
      "",
      [Validators.required, Validators.email, Validators.maxLength(160)],
    ],
    message: ["", [Validators.required, Validators.maxLength(1000)]],
  });

  submitted = false;

  submit(): void {
    this.submitted = false;
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.submitted = true;
  }
}
