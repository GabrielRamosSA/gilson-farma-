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
  vendasHoje = 2547.80;
  lucroMensal = 45890.50;
  pedidosPendentes = 0;
  totalProdutos = 156;

  pedidosParaAprovar: any[] = [];

  constructor(
    private router: Router, 
    private toastr: ToastrService,
    private pedidosService: PedidosService
  ) {}

  ngOnInit() {
    this.carregarPedidos();
    this.pedidosService.pedidos$.subscribe(pedidos => {
      this.pedidosParaAprovar = pedidos;
      this.pedidosPendentes = pedidos.length;
    });
  }

  carregarPedidos() {
    this.pedidosParaAprovar = this.pedidosService.getPedidos();
    this.pedidosPendentes = this.pedidosParaAprovar.length;
  }

  sair(): void {
    this.router.navigateByUrl('/login');
  }

  aprovarPedido(id: number): void {
    const pedido = this.pedidosParaAprovar.find(p => p.id === id);
    if (pedido) {
      this.toastr.success(`Pedido de ${pedido.cliente} aprovado!`, 'Sucesso');
      this.pedidosService.removerPedido(id);
    }
  }

  rejeitarPedido(id: number): void {
    const pedido = this.pedidosParaAprovar.find(p => p.id === id);
    if (pedido) {
      this.toastr.error(`Pedido de ${pedido.cliente} rejeitado`, 'Pedido Rejeitado');
      this.pedidosService.removerPedido(id);
    }
  }
}
