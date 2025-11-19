import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    CardModule, ReactiveFormsModule, InputTextModule, DropdownModule,
    CalendarModule, ToastModule, RippleModule, ButtonModule, InputMaskModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formGroup = new FormGroup({
    usuario: new FormControl('', Validators.required),
    senha: new FormControl('', Validators.required)
  });

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  onSubmit() {
    if (this.formGroup.valid) {
      if (
        this.formGroup.value.usuario === 'admin' &&
        this.formGroup.value.senha === 'admin'
      ) {
        this.router.navigate(['/dashboard']);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Usuário ou senha incorretos!'
        });
        this.formGroup.reset();
      }
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
  voltar(){
    this.router.navigateByUrl('/');
  }
}