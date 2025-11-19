import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';

interface Horarios {
  hora: string;
  disabled?: boolean;
}

interface Dias {
  dia: string;
}

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    CardModule, ReactiveFormsModule, InputTextModule, DropdownModule,
    CalendarModule, ToastModule, RippleModule, ButtonModule, InputMaskModule
  ],
  providers: [MessageService],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  horarios: Horarios[] = [];
  dias: Dias[] = [];
  formGroup: FormGroup;
  constructor(private messageService: MessageService, private router: Router, private primengConfig: PrimeNGConfig) {
    this.formGroup = new FormGroup({
      selecionarHorarios: new FormControl<Horarios | null>(null, Validators.required),
      selecionarDias: new FormControl<Dias | null>(null, Validators.required),
      nome: new FormControl<string | null>(null, Validators.required),
      dataNascimento: new FormControl<string | null>(null, Validators.required),
      numeroTelefone: new FormControl<string | null>(null, Validators.required),
      bairro : new FormControl<string | null>(null, Validators.required),
      rua : new FormControl<string | null>(null, Validators.required),
      numero : new FormControl<number | null>(null, Validators.required),
    });
  }
  ngOnInit() {

    this.primengConfig.setTranslation({
      accept: 'Sim',
      reject: 'Não',
      dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      today: 'Hoje',
      clear: 'Limpar',
      dateFormat: 'dd/mm/aaaa',
      weekHeader: 'Sm'
    });

    this.horarios = [
      { hora: '8:00' },
      { hora: '9:00' },
      { hora: '10:00' },
      { hora: '11:00' },
      { hora: '13:00' },
      { hora: '14:00' },
      { hora: '15:00' },
      { hora: '16:00' },
      { hora: '17:00' }
    ];

    this.dias = [
      { dia: 'Segunda-feira' },
      { dia: 'Terça-feira' },
      { dia: 'Quarta-feira' },
      { dia: 'Quinta-feira' },
      { dia: 'Sexta-feira' },
    ];

    this.formGroup.get('selecionarDias')?.valueChanges.subscribe(dia => {
      this.updateHorarios(dia);
    });
  }


  updateHorarios(dia: Dias | null) {
    if (!dia) return;

    const storedAgendamentos = localStorage.getItem('agendamentos');
    if (storedAgendamentos) {
      const agendamentos = JSON.parse(storedAgendamentos) as any[];
      const horariosOcupados = agendamentos
        .filter(a => a.dia === dia.dia)
        .map(a => a.hora);

      this.horarios.forEach(horario => {
        horario.disabled = horariosOcupados.includes(horario.hora);
      });
    }
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const agendamento = {
        nome: this.formGroup.value.nome,
        dataNascimento: this.formGroup.value.dataNascimento,
        numeroTelefone: this.formGroup.value.numeroTelefone,
        bairro: this.formGroup.value.bairro,
        rua: this.formGroup.value.rua,
        numero: this.formGroup.value.numero,
        dia: this.formGroup.value.selecionarDias?.dia,
        hora: this.formGroup.value.selecionarHorarios?.hora,
      };

      let agendamentos = [];
      const storedAgendamentos = localStorage.getItem('agendamentos');
      if (storedAgendamentos) {
        agendamentos = JSON.parse(storedAgendamentos);
      }
      agendamentos.push(agendamento);
      localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Você foi cadastrado!!' });
      this.formGroup.reset();
      this.updateHorarios(this.formGroup.value.selecionarDias); 
    } else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Preencha o formulario corretamente' });

    }
  }

  formatDate(dateString: string): string {
    const dateParts = dateString.split('/');
    if (dateParts.length === 3) {
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }
    return dateString;
  }
  dashboard() {
    this.router.navigateByUrl('/dashboard');
  }
  tabela() {
    this.router.navigateByUrl('/tabela');
  }
   login() {
    this.router.navigateByUrl('/login');
  }
  medicamentos() {
    this.router.navigateByUrl('/medicamentos');
  }
  limparDados() {
    localStorage.removeItem('agendamentos');
    this.messageService.add({ severity: 'warn', summary: 'Dados Limpos', detail: 'Todos os dados foram apagados!' });
    this.updateHorarios(this.formGroup.value.selecionarDias); 
  }
  
}