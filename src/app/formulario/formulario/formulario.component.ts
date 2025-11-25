import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

interface Servico {
  id: string;
  nome: string;
  duracao: string;
  preco: string;
  icone: string;
}

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  // Controle de abas
  abaAtiva: 'agendar' | 'consultar' = 'agendar';
  
  // Dados do agendamento
  nome = '';
  telefone = '';
  servicoSelecionado = '';
  dataSelecionada = '';
  horarioSelecionado = '';
  
  // Consulta de agendamentos
  telefoneConsulta = '';
  agendamentosCliente: any[] = [];
  carregandoConsulta = false;
  
  // Horários disponíveis
  horariosDisponiveis: string[] = [];
  carregandoHorarios = false;
  
  // Data atual para input date
  dataAtual = new Date();
  
  servicos: Servico[] = [
    { id: '1', nome: 'Consulta Farmacêutica', duracao: '30min', preco: 'Grátis', icone: 'fa-user-md' },
  ];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {}

  mudarAba(aba: 'agendar' | 'consultar') {
    this.abaAtiva = aba;
  }

  onDataChange() {
    if (!this.dataSelecionada) return;

    this.carregandoHorarios = true;
    this.http.get<any>(`http://localhost:3001/api/agendamentos/horarios-disponiveis?data=${this.dataSelecionada}`)
      .subscribe({
        next: (response) => {
          this.horariosDisponiveis = response.horariosDisponiveis;
          this.carregandoHorarios = false;
        },
        error: (error) => {
          console.error('Erro ao buscar horários:', error);
          this.horariosDisponiveis = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
          this.carregandoHorarios = false;
        }
      });
  }

  agendarConsulta() {
    if (!this.nome || !this.telefone || !this.servicoSelecionado || !this.dataSelecionada || !this.horarioSelecionado) {
      this.toastr.error('Preencha todos os campos', 'Erro');
      return;
    }

    const agendamento = {
      nome: this.nome,
      telefone: this.telefone,
      servico: this.servicoSelecionado,
      data: this.dataSelecionada,
      horario: this.horarioSelecionado
    };

    this.http.post('http://localhost:3001/api/agendamentos', agendamento)
      .subscribe({
        next: (response) => {
          this.toastr.success('Agendamento realizado com sucesso!', 'Sucesso', { timeOut: 4000 });
          this.limparFormulario();
        },
        error: (error) => {
          console.error('Erro ao agendar:', error);
          this.toastr.error('Erro ao realizar agendamento', 'Erro');
        }
      });
  }

  buscarAgendamentos() {
    if (!this.telefoneConsulta || this.telefoneConsulta.length < 10) {
      this.toastr.error('Digite um telefone válido', 'Erro');
      return;
    }

    this.carregandoConsulta = true;
    this.http.get<any[]>(`http://localhost:3001/api/agendamentos?telefone=${this.telefoneConsulta}`)
      .subscribe({
        next: (agendamentos) => {
          this.agendamentosCliente = agendamentos;
          this.carregandoConsulta = false;
          
          if (agendamentos.length === 0) {
            this.toastr.info('Nenhum agendamento encontrado', 'Info');
          }
        },
        error: (error) => {
          console.error('Erro ao buscar agendamentos:', error);
          this.toastr.error('Erro ao buscar agendamentos', 'Erro');
          this.carregandoConsulta = false;
        }
      });
  }

  cancelarAgendamento(id: string) {
    this.confirmationService.confirm({
      message: 'Deseja realmente cancelar este agendamento?',
      header: 'Confirmar Cancelamento',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, cancelar',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.http.patch(`http://localhost:3001/api/agendamentos/${id}`, { status: 'CANCELADO' })
          .subscribe({
            next: () => {
              this.toastr.success('Agendamento cancelado', 'Sucesso');
              this.buscarAgendamentos();
            },
            error: (error) => {
              console.error('Erro ao cancelar:', error);
              this.toastr.error('Erro ao cancelar agendamento', 'Erro');
            }
          });
      }
    });
  }

  limparFormulario() {
    this.nome = '';
    this.telefone = '';
    this.servicoSelecionado = '';
    this.dataSelecionada = '';
    this.horarioSelecionado = '';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ATIVO': return '#10b981';
      case 'FINALIZADO': return '#3b82f6';
      case 'CANCELADO': return '#ef4444';
      default: return '#94a3b8';
    }
  }

  medicamentos() {
    this.router.navigateByUrl('/medicamentos');
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  aplicarMascaraTelefone(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    
    if (valor.length <= 11) {
      if (valor.length <= 2) {
        valor = valor.replace(/^(\d{0,2})/, '($1');
      } else if (valor.length <= 7) {
        valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      } else {
        valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      }
    }
    
    event.target.value = valor;
    
    if (event.target.name === 'telefone') {
      this.telefone = valor;
    } else if (event.target.name === 'telefoneConsulta') {
      this.telefoneConsulta = valor;
    }
  }
}