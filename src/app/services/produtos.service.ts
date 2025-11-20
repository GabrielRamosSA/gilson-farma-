import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produto {
  id?: string;
  nome: string;
  imagem: string;
  descricao: string;
  preco: string;
  precoAntigo: string | null;
  quantidade: number;
  promocao: boolean;
  desconto: number;
  tipo: string;
  categoria: string;
  palavrasChave: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  private apiUrl = 'http://localhost:3001/api/produtos';

  constructor(private http: HttpClient) {}

  getProdutos(categoria?: string, tipo?: string): Observable<Produto[]> {
    let url = this.apiUrl;
    const params: string[] = [];
    
    if (categoria && categoria !== 'Todos') {
      params.push(`categoria=${categoria}`);
    }
    if (tipo && tipo !== 'Todos') {
      params.push(`tipo=${tipo}`);
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return this.http.get<Produto[]>(url);
  }

  adicionarProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  removerProduto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  gerarPalavrasChave(nome: string, descricao: string, categoria: string): string[] {
    const palavras = new Set<string>();
    
    nome.toLowerCase().split(' ').forEach(palavra => {
      if (palavra.length > 2) palavras.add(palavra);
    });
    
    descricao.toLowerCase().split(' ').forEach(palavra => {
      if (palavra.length > 3) palavras.add(palavra);
    });
    
    palavras.add(categoria.toLowerCase());
    
    const palavrasCategoria: { [key: string]: string[] } = {
      'Medicamentos': ['medicamento', 'remedio', 'tratamento'],
      'Vitaminas': ['vitamina', 'suplemento', 'saude'],
      'Infantil': ['infantil', 'crianca', 'bebe'],
      'Higiene': ['higiene', 'limpeza', 'cuidado'],
      'Cosméticos': ['cosmetico', 'beleza', 'pele'],
      'Bucal': ['bucal', 'dente', 'oral']
    };
    
    if (palavrasCategoria[categoria]) {
      palavrasCategoria[categoria].forEach(p => palavras.add(p));
    }
    
    return Array.from(palavras).slice(0, 10);
  }
}
