import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import localePt from '@angular/common/locales/pt';
import { PedidosService } from '../services/pedidos.service';

registerLocaleData(localePt);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  dataAtual = new Date();
  vendasHoje = 0;
  lucroMensal = 0;
  pedidosPendentes = 0;
  totalProdutos = 156;

  pedidosParaAprovar: any[] = [];
  carregandoEstatisticas = false;

  constructor(
    private router: Router, 
    private toastr: ToastrService,
    private pedidosService: PedidosService
  ) {}

  ngOnInit() {
    this.carregarEstatisticas();
    this.carregarPedidos();
    this.pedidosService.pedidos$.subscribe(pedidos => {
      this.pedidosParaAprovar = pedidos;
      this.pedidosPendentes = pedidos.length;
    });
  }

  carregarEstatisticas() {
    this.carregandoEstatisticas = true;
    this.pedidosService.getEstatisticas().subscribe({
      next: (stats) => {
        this.vendasHoje = stats.vendasHoje;
        this.lucroMensal = stats.lucroMensal;
        this.pedidosPendentes = stats.pedidosPendentes;
        this.carregandoEstatisticas = false;
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
        this.carregandoEstatisticas = false;
      }
    });
  }

  carregarPedidos() {
    this.pedidosService.carregarPedidos();
  }

  sair(): void {
    this.router.navigateByUrl('/login');
  }

  aprovarPedido(id: string): void {
    const pedido = this.pedidosParaAprovar.find(p => p.id === id);
    if (pedido) {
      this.pedidosService.aprovarPedido(id).subscribe({
        next: () => {
          this.toastr.success(`Pedido de ${pedido.cliente} aprovado!`, 'Sucesso');
          this.carregarEstatisticas(); // Atualizar estatísticas após aprovar
        },
        error: (error) => {
          console.error('Erro ao aprovar pedido:', error);
          this.toastr.error('Erro ao aprovar pedido', 'Erro');
        }
      });
    }
  }

  rejeitarPedido(id: string): void {
    const pedido = this.pedidosParaAprovar.find(p => p.id === id);
    if (pedido) {
      this.pedidosService.rejeitarPedido(id).subscribe({
        next: () => {
          this.toastr.error(`Pedido de ${pedido.cliente} rejeitado`, 'Pedido Rejeitado');
        },
        error: (error) => {
          console.error('Erro ao rejeitar pedido:', error);
          this.toastr.error('Erro ao rejeitar pedido', 'Erro');
        }
      });
    }
  }

  navegarParaAdicionar(): void {
    this.router.navigate(['/adicionar-produto']);
  }
}
