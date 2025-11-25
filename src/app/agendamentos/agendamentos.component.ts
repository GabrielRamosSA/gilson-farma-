import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './agendamentos.component.html',
  styleUrls: ['./agendamentos.component.css']
})
export class AgendamentosComponent implements OnInit {
  agendamentos: any[] = [];
  agendamentosFiltrados: any[] = [];
  carregando = false;
  dataFiltro: string = '';
  diaSemanaSelecionado: string = '';

  diasSemana = [
    { nome: 'Dom', valor: 0 },
    { nome: 'Seg', valor: 1 },
    { nome: 'Ter', valor: 2 },
    { nome: 'Qua', valor: 3 },
    { nome: 'Qui', valor: 4 },
    { nome: 'Sex', valor: 5 },
    { nome: 'Sáb', valor: 6 }
  ];

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.carregarAgendamentos();
  }

  carregarAgendamentos() {
    this.carregando = true;
    this.http.get<any[]>('http://localhost:3001/api/agendamentos/todos').subscribe({
      next: (agendamentos) => {
        this.agendamentos = agendamentos;
        this.agendamentosFiltrados = agendamentos;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar agendamentos:', error);
        this.toastr.error('Erro ao carregar agendamentos', 'Erro');
        this.carregando = false;
      }
    });
  }

  filtrarPorData() {
    if (!this.dataFiltro) {
      this.agendamentosFiltrados = this.agendamentos;
      return;
    }

    const dataFiltroObj = new Date(this.dataFiltro + 'T00:00:00');
    this.agendamentosFiltrados = this.agendamentos.filter(ag => {
      const dataAgendamento = new Date(ag.data);
      return dataAgendamento.toDateString() === dataFiltroObj.toDateString();
    });

    this.toastr.info(`${this.agendamentosFiltrados.length} agendamentos encontrados`, 'Filtro');
  }

  filtrarPorDiaSemana(dia: number) {
    if (this.diaSemanaSelecionado === dia.toString()) {
      this.diaSemanaSelecionado = '';
      this.agendamentosFiltrados = this.agendamentos;
      return;
    }

    this.diaSemanaSelecionado = dia.toString();
    this.agendamentosFiltrados = this.agendamentos.filter(ag => {
      const dataAgendamento = new Date(ag.data);
      return dataAgendamento.getDay() === dia;
    });

    const nomeDia = this.diasSemana.find(d => d.valor === dia)?.nome;
    this.toastr.info(`${this.agendamentosFiltrados.length} agendamentos na ${nomeDia}`, 'Filtro');
  }

  limparFiltros() {
    this.dataFiltro = '';
    this.diaSemanaSelecionado = '';
    this.agendamentosFiltrados = this.agendamentos;
    this.toastr.info('Filtros limpos', 'Filtros');
  }

  finalizarConsulta(id: string) {
    const agendamento = this.agendamentos.find(ag => ag.id === id);
    
    this.confirmationService.confirm({
      message: `Deseja realmente finalizar a consulta de ${agendamento?.nome}?`,
      header: 'Finalizar Consulta',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Sim, finalizar',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.http.patch(`http://localhost:3001/api/agendamentos/${id}`, { status: 'FINALIZADO' })
          .subscribe({
            next: () => {
              this.toastr.success('Consulta finalizada com sucesso', 'Sucesso');
              this.carregarAgendamentos();
            },
            error: (error) => {
              console.error('Erro ao finalizar consulta:', error);
              this.toastr.error('Erro ao finalizar consulta', 'Erro');
            }
          });
      }
    });
  }

  cancelarConsulta(id: string) {
    const agendamento = this.agendamentos.find(ag => ag.id === id);
    
    this.confirmationService.confirm({
      message: `Deseja realmente cancelar a consulta de ${agendamento?.nome}?`,
      header: 'Cancelar Consulta',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, cancelar',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.http.patch(`http://localhost:3001/api/agendamentos/${id}`, { status: 'CANCELADO' })
          .subscribe({
            next: () => {
              this.toastr.warning('Consulta cancelada', 'Cancelada');
              this.carregarAgendamentos();
            },
            error: (error) => {
              console.error('Erro ao cancelar consulta:', error);
              this.toastr.error('Erro ao cancelar consulta', 'Erro');
            }
          });
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ATIVO': return '#10b981';
      case 'FINALIZADO': return '#3b82f6';
      case 'CANCELADO': return '#ef4444';
      default: return '#94a3b8';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'ATIVO': return 'fa-clock';
      case 'FINALIZADO': return 'fa-check-circle';
      case 'CANCELADO': return 'fa-times-circle';
      default: return 'fa-question-circle';
    }
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }
}
