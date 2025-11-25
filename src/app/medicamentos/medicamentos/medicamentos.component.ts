import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PedidosService } from '../../services/pedidos.service';
import { ProdutosService } from '../../services/produtos.service';
import { MercadoPagoService } from '../../services/mercadopago.service';

@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] 
})
export class MedicamentosComponent implements OnInit, OnDestroy {
  
  carrinho: { nome: string, quantidade: number }[] = [];
  
  modalAberto = false;
  modalFinalizarAberto = false;
  filtroAtivo = 'Todos';
  termoPesquisa = '';
  categoriaAtiva = 'Todos';
  
  clienteForm = {
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    tipoEntrega: 'retirada',
    metodoPagamento: 'dinheiro'
  };

  mostrarQRCodePix = false;
  qrCodePixData = '';
  pixCopiaCola = '';
  valorTotalPedido = 0;

  produtos: any[] = [];
  carregandoProdutos = false;
  
  private intervalId: any;
  pagamentoId: string | null = null;

  constructor(
    private router: Router, 
    private toastr: ToastrService,
    private pedidosService: PedidosService,
    private produtosService: ProdutosService,
    private mercadoPagoService: MercadoPagoService
  ) {}

  ngOnInit() {
    this.carregarProdutos();
    
    this.intervalId = setInterval(() => {
      this.carregarProdutosSilencioso();
    }, 30000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  carregarProdutos() {
    this.carregandoProdutos = true;
    this.produtosService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.carregandoProdutos = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.toastr.error('Erro ao carregar produtos. Usando dados locais.', 'Erro');
        this.carregandoProdutos = false;
      }
    });
  }

  carregarProdutosSilencioso() {
    this.produtosService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
      },
      error: (error) => {
        console.error('Erro ao atualizar produtos:', error);
      }
    });
  }

  get produtosFiltrados() {
    let produtosFiltradosPorTipo = this.produtos;
    
    if (this.categoriaAtiva !== 'Todos') {
      produtosFiltradosPorTipo = this.produtos.filter(produto => produto.categoria === this.categoriaAtiva);
    }

    if (this.filtroAtivo !== 'Todos') {
      produtosFiltradosPorTipo = produtosFiltradosPorTipo.filter(produto => produto.tipo === this.filtroAtivo);
    }
    
    if (this.termoPesquisa.trim() === '') {
      return produtosFiltradosPorTipo;
    }
    
    const termo = this.termoPesquisa.toLowerCase().trim();
    
    return produtosFiltradosPorTipo.filter(produto => {
      const nomeMatch = produto.nome.toLowerCase().includes(termo);
      const descricaoMatch = produto.descricao.toLowerCase().includes(termo);
      const palavrasChaveMatch = produto.palavrasChave && produto.palavrasChave.some((palavra: string) => 
        palavra.toLowerCase().includes(termo)
      );
      
      return nomeMatch || descricaoMatch || palavrasChaveMatch;
    });
  }

  get contadorCarrinho(): number {
    return this.carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  }

  filtrarPorCategoria(categoria: string) {
    this.categoriaAtiva = categoria;
    this.filtroAtivo = 'Todos';
    this.termoPesquisa = '';
    
    setTimeout(() => {
      const secaoProdutos = document.getElementById('secao-produtos');
      if (secaoProdutos) {
        secaoProdutos.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
    
    if (categoria === 'Todos') {
      this.toastr.info('Mostrando todos os produtos', 'Filtro', {
        timeOut: 2000,
        progressBar: true
      });
    } else {
      this.toastr.info(`Filtrando por categoria: ${categoria}`, 'Categoria', {
        timeOut: 2000,
        progressBar: true
      });
    }
  }

  filtrarProdutos(tipo: string) {
    this.filtroAtivo = tipo;
    this.toastr.info(`Filtrando produtos: ${tipo}`, 'Filtro Aplicado', {
      timeOut: 2000,
      progressBar: true
    });
  }

  limparPesquisa() {
    this.termoPesquisa = '';
    this.toastr.info('Pesquisa limpa', 'Busca', {
      timeOut: 2000,
      progressBar: true
    });
  }

  limparTodosFiltros() {
    this.categoriaAtiva = 'Todos';
    this.filtroAtivo = 'Todos';
    this.termoPesquisa = '';
    
    this.toastr.info('Todos os filtros foram limpos', 'Filtros', {
      timeOut: 2000,
      progressBar: true
    });
  }

  adicionarAoCarrinho(produto: string) {
    const index = this.carrinho.findIndex(p => p.nome === produto);
    if (index >= 0) {
      this.carrinho[index].quantidade++;
    } else {
      this.carrinho.push({ nome: produto, quantidade: 1 });
    }
    
    this.toastr.success(`${produto} adicionado ao carrinho!`, 'Sucesso!');
  }

  removerDoCarrinho(index: number) {
    const produtoRemovido = this.carrinho[index];
    this.carrinho.splice(index, 1);
    
    this.toastr.warning(`${produtoRemovido.nome} removido do carrinho`, 'Item Removido', {
      timeOut: 3000,
      progressBar: true
    });
  }

  abrirCarrinho() {
    this.modalAberto = true;
    if (this.carrinho.length === 0) {
      this.toastr.info('Seu carrinho está vazio', 'Carrinho', {
        timeOut: 2000,
        progressBar: true
      });
    }
  }

  fecharCarrinho() {
    this.modalAberto = false;
  }

  voltar() {
    this.router.navigate(['/formulario']); 
  }

  finalizarCompra() {
    if (this.carrinho.length === 0) {
      this.toastr.error('Adicione produtos ao carrinho antes de finalizar', 'Carrinho Vazio', {
        timeOut: 3000,
        progressBar: true
      });
      return;
    }

    this.fecharCarrinho();
    this.modalFinalizarAberto = true;
  }

  fecharModalFinalizar() {
    this.modalFinalizarAberto = false;
    this.limparFormulario();
  }

  limparFormulario() {
    this.clienteForm = {
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
      tipoEntrega: 'retirada',
      metodoPagamento: 'dinheiro'
    };
    this.mostrarQRCodePix = false;
    this.qrCodePixData = '';
    this.pixCopiaCola = '';
  }

  enviarPedido() {
    if (!this.clienteForm.nome || !this.clienteForm.email || !this.clienteForm.telefone) {
      this.toastr.error('Preencha todos os campos obrigatórios', 'Formulário Incompleto');
      return;
    }

    if (this.clienteForm.tipoEntrega === 'delivery' && !this.clienteForm.endereco) {
      this.toastr.error('Endereço é obrigatório para delivery', 'Formulário Incompleto');
      return;
    }

    this.valorTotalPedido = this.calcularPrecoTotal();

    if (this.clienteForm.metodoPagamento === 'pix') {
      this.gerarQRCodePix();
    } else {
      this.finalizarPedido();
    }
  }

  gerarQRCodePix() {
    const valorTotal = this.calcularPrecoTotal();
    
    const descricaoPedido = JSON.stringify({
      cliente: this.clienteForm.nome,
      email: this.clienteForm.email,
      telefone: this.clienteForm.telefone,
      itens: this.carrinho
    });

    const dadosPagamento = {
      transaction_amount: valorTotal,
      description: descricaoPedido,
      payer: {
        email: this.clienteForm.email,
        first_name: this.clienteForm.nome,
        last_name: ''
      }
    };

    this.toastr.info('Gerando PIX...', 'Aguarde');

    this.mercadoPagoService.criarPagamentoPix(dadosPagamento).subscribe({
      next: (response) => {
        console.log('PIX gerado:', response);
        
        this.pagamentoId = response.id;
        this.pixCopiaCola = response.qr_code;
        this.qrCodePixData = `data:image/png;base64,${response.qr_code_base64}`;
        this.mostrarQRCodePix = true;
        
        this.toastr.success('PIX gerado com sucesso!', 'Mercado Pago');
        
        this.verificarPagamentoAutomatico();
      },
      error: (error) => {
        console.error('Erro ao gerar PIX:', error);
        this.toastr.error('Erro ao gerar PIX. Tente novamente.', 'Erro');
      }
    });
  }

  verificarPagamentoAutomatico() {
    if (!this.pagamentoId) return;

    const intervalo = setInterval(() => {
      if (!this.pagamentoId) {
        clearInterval(intervalo);
        return;
      }

      this.mercadoPagoService.verificarPagamento(this.pagamentoId).subscribe({
        next: (response) => {
          console.log('Status do pagamento:', response.status);
          
          if (response.status === 'approved') {
            clearInterval(intervalo);
            this.toastr.success('Pagamento confirmado!', 'Sucesso');
            this.finalizarPedido();
          }
        },
        error: (error) => {
          console.error('Erro ao verificar pagamento:', error);
        }
      });
    }, 5000);

    setTimeout(() => {
      clearInterval(intervalo);
    }, 600000);
  }

  copiarCodigoPix() {
    navigator.clipboard.writeText(this.pixCopiaCola).then(() => {
      this.toastr.success('Código PIX copiado!', 'Sucesso');
    }).catch(() => {
      this.toastr.error('Erro ao copiar código', 'Erro');
    });
  }

  confirmarPagamentoPix() {
    this.finalizarPedido();
  }

  finalizarPedido() {
    const pedidoData = {
      cliente: this.clienteForm.nome,
      email: this.clienteForm.email,
      telefone: this.clienteForm.telefone,
      endereco: this.clienteForm.endereco,
      tipoEntrega: this.clienteForm.tipoEntrega,
      metodoPagamento: this.clienteForm.metodoPagamento,
      produtos: this.carrinho,
      valor: this.valorTotalPedido
    };

    console.log('📝 Salvando pedido no banco:', pedidoData);

    this.pedidosService.adicionarPedidoComRetorno(pedidoData).subscribe({
      next: (pedidoCriado) => {
        console.log('✅ Pedido salvo com sucesso:', pedidoCriado);
        
        const mensagem = this.clienteForm.tipoEntrega === 'delivery' 
          ? 'Pedido enviado! Aguarde a aprovação para entrega.' 
          : 'Pedido enviado! Retire na loja após aprovação.';
        
        this.toastr.success(mensagem, 'Sucesso');
        this.carrinho = [];
        this.fecharModalFinalizar();
      },
      error: (error) => {
        console.error('❌ Erro ao salvar pedido:', error);
        this.toastr.error('Erro ao salvar pedido. Tente novamente.', 'Erro');
      }
    });
  }

  calcularPrecoTotal(): number {
    return this.carrinho.reduce((total, item) => {
      const produto = this.produtos.find(p => p.nome === item.nome);
      if (produto) {
        const preco = parseFloat(produto.preco.replace('R$', '').replace(',', '.'));
        return total + (preco * item.quantidade);
      }
      return total;
    }, 0);
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
    this.clienteForm.telefone = valor;
  }
}
