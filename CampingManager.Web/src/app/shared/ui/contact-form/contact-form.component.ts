import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container my-5">
      <form class="contact-form p-4 bg-light rounded">
        <div class="mb-3"><label>Nome</label><input type="text" class="form-control"></div>
        <div class="mb-3"><label>Email</label><input type="email" class="form-control"></div>
        <div class="mb-3"><label>Messaggio</label><textarea class="form-control" rows="4"></textarea></div>
        <button type="submit" class="btn btn-primary" style="background: var(--site-green);">Invia</button>
      </form>
    </div>
  `
})
export class ContactFormComponent { }
