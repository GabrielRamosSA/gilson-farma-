import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProdutosService } from '../services/produtos.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-adicionar-produto',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule],
  templateUrl: './adicionar-produto.component.html',
  styleUrl: './adicionar-produto.component.css'
})
export class AdicionarProdutoComponent implements OnInit {
  produto = {
    nome: '',
    imagem: '',
    descricao: '',
    preco: '',
    precoAntigo: '',
    quantidade: 0,
    promocao: false,
    desconto: 0,
    tipo: 'Genéricos',
    categoria: 'Medicamentos'
  };

  tipos = ['Genéricos', 'Referência', 'Similares', 'Suplementos', 'Infantil', 'Higiene', 'Cosméticos', 'Bucal'];
  categorias = ['Medicamentos', 'Vitaminas', 'Infantil', 'Higiene', 'Cosméticos', 'Bucal'];

  imagemPreview: string | null = null;
  carregando = false;

  // Novas propriedades para remover produtos
  mostrarSecaoRemover = false;
  produtosParaRemover: any[] = [];
  termoPesquisaRemover = '';
  carregandoRemocao = false;

  // Propriedades para o modal de confirmação
  mostrarModalConfirmacao = false;
  produtoParaRemover: { id: string, nome: string } | null = null;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private produtosService: ProdutosService
  ) {}

  ngOnInit() {
    this.carregarProdutosParaRemover();
  }

  onImagemSelecionada(event: any) {
    const arquivo = event.target.files[0];
    if (arquivo) {
      if (arquivo.size > 5000000) { // 5MB
        this.toastr.error('Imagem muito grande! Máximo 5MB', 'Erro');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagemPreview = e.target.result;
        this.produto.imagem = e.target.result;
      };
      reader.readAsDataURL(arquivo);
    }
  }

  removerImagem() {
    this.imagemPreview = null;
    this.produto.imagem = '';
  }

  calcularDesconto() {
    if (this.produto.preco && this.produto.precoAntigo) {
      const precoAtual = parseFloat(this.produto.preco.replace('R$', '').replace(',', '.').trim());
      const precoAntigo = parseFloat(this.produto.precoAntigo.replace('R$', '').replace(',', '.').trim());
      
      if (precoAntigo > precoAtual) {
        this.produto.desconto = Math.round(((precoAntigo - precoAtual) / precoAntigo) * 100);
        this.produto.promocao = true;
      } else {
        this.produto.desconto = 0;
        this.produto.promocao = false;
      }
    }
  }

  formatarPreco(campo: 'preco' | 'precoAntigo') {
    let valor = this.produto[campo].replace(/\D/g, '');
    if (valor) {
      valor = (parseInt(valor) / 100).toFixed(2);
      this.produto[campo] = `R$ ${valor.replace('.', ',')}`;
    }
  }

  validarFormulario(): boolean {
    if (!this.produto.nome.trim()) {
      this.toastr.error('Nome do produto é obrigatório', 'Erro');
      return false;
    }

    if (!this.produto.imagem) {
      this.toastr.error('Imagem do produto é obrigatória', 'Erro');
      return false;
    }

    if (!this.produto.descricao.trim()) {
      this.toastr.error('Descrição do produto é obrigatória', 'Erro');
      return false;
    }

    if (!this.produto.preco) {
      this.toastr.error('Preço do produto é obrigatório', 'Erro');
      return false;
    }

    if (this.produto.quantidade < 0) {
      this.toastr.error('Quantidade não pode ser negativa', 'Erro');
      return false;
    }

    return true;
  }

  adicionarProduto() {
    if (!this.validarFormulario()) {
      return;
    }

    this.carregando = true;

    const palavrasChave = this.produtosService.gerarPalavrasChave(
      this.produto.nome,
      this.produto.descricao,
      this.produto.categoria
    );

    const produtoParaEnviar = {
      nome: this.produto.nome,
      imagem: this.produto.imagem,
      descricao: this.produto.descricao,
      preco: this.produto.preco,
      precoAntigo: this.produto.precoAntigo || null,
      quantidade: this.produto.quantidade,
      promocao: this.produto.promocao,
      desconto: this.produto.desconto,
      tipo: this.produto.tipo,
      categoria: this.produto.categoria,
      palavrasChave: palavrasChave
    };

    this.produtosService.adicionarProduto(produtoParaEnviar).subscribe({
      next: (response) => {
        this.toastr.success('Produto adicionado com sucesso!', 'Sucesso');
        setTimeout(() => {
          this.router.navigate(['/medicamentos']);
        }, 1500);
      },
      error: (error) => {
        console.error('Erro ao adicionar produto:', error);
        this.toastr.error('Erro ao adicionar produto. Tente novamente.', 'Erro');
        this.carregando = false;
      }
    });
  }

  carregarProdutosParaRemover() {
    console.log('Tentando carregar produtos...');
    this.produtosService.getProdutos().subscribe({
      next: (produtos) => {
        console.log('Produtos carregados:', produtos);
        this.produtosParaRemover = produtos;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.toastr.error('Erro ao carregar produtos do servidor', 'Erro');
      }
    });
  }

  get produtosFiltradosParaRemover() {
    if (!this.termoPesquisaRemover.trim()) {
      return this.produtosParaRemover;
    }
    
    const termo = this.termoPesquisaRemover.toLowerCase();
    return this.produtosParaRemover.filter(produto => 
      produto.nome.toLowerCase().includes(termo) ||
      produto.categoria.toLowerCase().includes(termo) ||
      produto.tipo.toLowerCase().includes(termo)
    );
  }

  toggleSecaoRemover() {
    this.mostrarSecaoRemover = !this.mostrarSecaoRemover;
    if (this.mostrarSecaoRemover) {
      this.carregarProdutosParaRemover();
    }
  }

  removerProduto(id: string, nome: string) {
    this.produtoParaRemover = { id, nome };
    this.mostrarModalConfirmacao = true;
  }

  confirmarRemocao() {
    if (!this.produtoParaRemover) return;

    this.carregandoRemocao = true;
    this.produtosService.removerProduto(this.produtoParaRemover.id).subscribe({
      next: () => {
        this.toastr.success(`${this.produtoParaRemover!.nome} removido com sucesso!`, 'Produto Removido');
        this.carregarProdutosParaRemover();
        this.carregandoRemocao = false;
        this.fecharModalConfirmacao();
      },
      error: (error) => {
        console.error('Erro ao remover produto:', error);
        this.toastr.error('Erro ao remover produto. Tente novamente.', 'Erro');
        this.carregandoRemocao = false;
        this.fecharModalConfirmacao();
      }
    });
  }

  fecharModalConfirmacao() {
    this.mostrarModalConfirmacao = false;
    this.produtoParaRemover = null;
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }
}
