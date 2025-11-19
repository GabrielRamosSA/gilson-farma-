import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Pedido {
  id: number;
  cliente: string;
  email: string;
  telefone: string;
  endereco: string;
  itens: number;
  produtos: { nome: string, quantidade: number }[];
  valor: number;
  data: Date;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private pedidosSubject = new BehaviorSubject<Pedido[]>([]);
  pedidos$ = this.pedidosSubject.asObservable();
  
  private proximoId = 1001;

  constructor() {
    const pedidosSalvos = localStorage.getItem('pedidos');
    if (pedidosSalvos) {
      const pedidos = JSON.parse(pedidosSalvos);
      pedidos.forEach((p: any) => p.data = new Date(p.data));
      this.pedidosSubject.next(pedidos);
      if (pedidos.length > 0) {
        this.proximoId = Math.max(...pedidos.map((p: Pedido) => p.id)) + 1;
      }
    }
  }

  adicionarPedido(pedido: Omit<Pedido, 'id' | 'data' | 'status'>): void {
    const novoPedido: Pedido = {
      ...pedido,
      id: this.proximoId++,
      data: new Date(),
      status: 'pendente'
    };
    
    const pedidosAtuais = this.pedidosSubject.value;
    const novosPedidos = [...pedidosAtuais, novoPedido];
    this.pedidosSubject.next(novosPedidos);
    localStorage.setItem('pedidos', JSON.stringify(novosPedidos));
  }

  getPedidos(): Pedido[] {
    return this.pedidosSubject.value;
  }

  removerPedido(id: number): void {
    const pedidosAtuais = this.pedidosSubject.value;
    const novosPedidos = pedidosAtuais.filter(p => p.id !== id);
    this.pedidosSubject.next(novosPedidos);
    localStorage.setItem('pedidos', JSON.stringify(novosPedidos));
  }
}
