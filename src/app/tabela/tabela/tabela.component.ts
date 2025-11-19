
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

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

@Component({
  selector: 'app-tabela',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.css']
})
export class TabelaComponent implements OnInit {
  agendamentos: Agendamento[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    const storedAgendamentos = localStorage.getItem('agendamentos');
    if (storedAgendamentos) {
      this.agendamentos = JSON.parse(storedAgendamentos);
    }
  }

  voltar() {
    this.router.navigateByUrl('/');
  }
}