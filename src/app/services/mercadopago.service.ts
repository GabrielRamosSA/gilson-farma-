import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  private apiUrl = 'http://localhost:3001/api/mercadopago';
  public publicKey = 'APP_USR-b3dbb92b-073d-4911-ae39-3c0de188a73f';

  constructor(private http: HttpClient) {}

  criarPagamentoPix(dados: {
    transaction_amount: number;
    description: string;
    payer: {
      email: string;
      first_name: string;
      last_name?: string;
    }
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/criar-pix`, dados);
  }

  verificarPagamento(paymentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verificar/${paymentId}`);
  }
}
