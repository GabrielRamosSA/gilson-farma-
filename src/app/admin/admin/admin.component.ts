import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

interface Agendamento {
  nome: string;
  dataNascimento: string;
  numeroTelefone: string;
  bairro: string;
  rua: string;
  numero: string;
  dia: string;
  hora: string;
}

interface HorarioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-tabela',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    CardModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    RippleModule,
    InputMaskModule
  ],
  providers: [MessageService],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  agendamentos: Agendamento[] = [];
  visible: boolean = false;
  formGroup: FormGroup;
  editIndex: number | null = null;

  dias = [
    { label: 'Segunda-feira', value: 'Segunda-feira' },
    { label: 'Terça-feira', value: 'Terça-feira' },
    { label: 'Quarta-feira', value: 'Quarta-feira' },
    { label: 'Quinta-feira', value: 'Quinta-feira' },
    { label: 'Sexta-feira', value: 'Sexta-feira' }
  ];

  horarios: HorarioOption[] = [
    { label: '8:00', value: '8:00' },
    { label: '9:00', value: '9:00' },
    { label: '10:00', value: '10:00' },
    { label: '11:00', value: '11:00' },
    { label: '14:00', value: '14:00' },
    { label: '15:00', value: '15:00' }
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.formGroup = this.fb.group({
      nome: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      numeroTelefone: ['', Validators.required],
      bairro: ['', Validators.required],
      rua: ['', Validators.required],
      numero: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], 
      dia: ['', Validators.required],
      hora: ['', Validators.required]
    });
  }

  ngOnInit() {
    const storedAgendamentos = localStorage.getItem('agendamentos');
    if (storedAgendamentos) {
      this.agendamentos = JSON.parse(storedAgendamentos);
    }
 
    this.formGroup.get('dia')?.valueChanges.subscribe(dia => {
      this.updateHorarios(dia);
    });

    this.updateHorarios(this.formGroup.value.dia);
  }

  showDialog(index: number) {
    this.editIndex = index;
    this.formGroup.patchValue(this.agendamentos[index]);
    this.visible = true;
 
    this.updateHorarios(this.agendamentos[index].dia);
  }

  updateHorarios(diaSelecionado: string) {

    const horariosBase: HorarioOption[] = [
      { label: '8:00', value: '8:00' },
      { label: '9:00', value: '9:00' },
      { label: '10:00', value: '10:00' },
      { label: '11:00', value: '11:00' },
      { label: '14:00', value: '14:00' },
      { label: '15:00', value: '15:00' }
    ];

    if (!diaSelecionado) {
      this.horarios = horariosBase;
      return;
    }

  
    const ocupados = this.agendamentos
      .filter((a, idx) => a.dia === diaSelecionado && idx !== this.editIndex)
      .map(a => a.hora);

 
    this.horarios = horariosBase.map(h => ({
      ...h,
      disabled: ocupados.includes(h.value)
    }));
  }

  onSubmit() {
    if (this.formGroup.valid && this.editIndex !== null) {
      const { dia, hora } = this.formGroup.value;
   
      const conflito = this.agendamentos.some((a, idx) =>
        idx !== this.editIndex && a.dia === dia && a.hora === hora
      );
      if (conflito) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Já existe um paciente agendado para este dia e horário!' });
        return;
      }

      this.agendamentos[this.editIndex] = this.formGroup.value;
      localStorage.setItem('agendamentos', JSON.stringify(this.agendamentos));
      this.visible = false;
      this.editIndex = null;
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Paciente atualizado com sucesso!' });
    } else{
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Preencha o formulário corretamente!' });
      this.formGroup.markAllAsTouched();
      return;
    }
  }

  removerAgendamento(index: number) {
    this.agendamentos.splice(index, 1);
    localStorage.setItem('agendamentos', JSON.stringify(this.agendamentos));
    this.messageService.add({ severity: 'info', summary: 'Removido', detail: 'Paciente removido com sucesso!' });
  }

  voltar() {
    this.router.navigateByUrl('/');
  }
}