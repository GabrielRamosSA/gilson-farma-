import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private apiUrl = 'http://localhost:3001/api/pedidos';
  private pedidosSubject = new BehaviorSubject<any[]>([]);
  public pedidos$ = this.pedidosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (pedidos) => {
        const pedidosPendentes = pedidos.filter(p => p.status === 'pendente');
        this.pedidosSubject.next(pedidosPendentes);
      },
      error: (error) => console.error('Erro ao carregar pedidos:', error)
    });
  }

  getPedidos(): any[] {
    return this.pedidosSubject.value;
  }

  adicionarPedido(pedido: any): void {
    this.http.post(this.apiUrl, pedido).pipe(
      tap(() => this.carregarPedidos())
    ).subscribe({
      next: (pedidoCriado) => {
        console.log('Pedido criado:', pedidoCriado);
      },
      error: (error) => console.error('Erro ao adicionar pedido:', error)
    });
  }

  adicionarPedidoComRetorno(pedido: any): Observable<any> {
    return this.http.post(this.apiUrl, pedido).pipe(
      tap(() => this.carregarPedidos())
    );
  }

  aprovarPedido(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, { status: 'aprovado' }).pipe(
      tap(() => this.carregarPedidos())
    );
  }

  rejeitarPedido(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, { status: 'rejeitado' }).pipe(
      tap(() => this.carregarPedidos())
    );
  }

  removerPedido(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.carregarPedidos())
    );
  }

  getEstatisticas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/estatisticas`);
  }
}
