import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PedidosService } from '../../services/pedidos.service';
import { ProdutosService } from '../../services/produtos.service';

@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] 
})
export class MedicamentosComponent implements OnInit {
  
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
  
  constructor(
    private router: Router, 
    private toastr: ToastrService,
    private pedidosService: PedidosService,
    private produtosService: ProdutosService
  ) {}

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.carregandoProdutos = true;
    this.produtosService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.carregandoProdutos = false;
        this.toastr.success('Produtos carregados com sucesso!', 'Sucesso', {
          timeOut: 2000
        });
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.toastr.error('Erro ao carregar produtos. Usando dados locais.', 'Erro');
        this.carregandoProdutos = false;
        // Mantém a lista local como fallback se a API falhar
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
    this.toastr.info('Retornando à página inicial', 'Navegação', {
      timeOut: 2000,
      progressBar: true
    });
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

    this.valorTotalPedido = this.carrinho.reduce((total, item) => {
      const produto = this.produtos.find(p => p.nome === item.nome);
      if (produto) {
        const preco = parseFloat(produto.preco.replace('R$ ', '').replace(',', '.'));
        return total + (preco * item.quantidade);
      }
      return total;
    }, 0);

    if (this.clienteForm.metodoPagamento === 'pix') {
      this.gerarQRCodePix();
    } else {
      this.finalizarPedido();
    }
  }

  gerarQRCodePix() {
    this.pixCopiaCola = this.gerarPixPayload();
    this.qrCodePixData = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(this.pixCopiaCola)}`;
    this.mostrarQRCodePix = true;
    this.toastr.info('PIX gerado! Copie o código ou escaneie o QR Code', 'PIX Gerado', { timeOut: 5000 });
  }

  copiarCodigoPix() {
    navigator.clipboard.writeText(this.pixCopiaCola).then(() => {
      this.toastr.success('Código PIX copiado!', 'Sucesso');
    }).catch(() => {
      this.toastr.error('Erro ao copiar código', 'Erro');
    });
  }

  gerarPixPayload(): string {
    // IMPORTANTE: Esta chave PIX precisa estar cadastrada no seu Nubank
    // Vá em: Nubank > Pix > Minhas Chaves > Cadastrar chave
    const pixKey = '89988028209';
    const merchantName = 'Gabriel Ramos';
    const merchantCity = 'PICOS';
    const valor = this.valorTotalPedido.toFixed(2);
    
    // Payload Format Indicator
    let payload = '000201';
    
    // Point of Initiation Method (12 = static)
    payload += '010212';
    
    // Merchant Account Information
    const gui = '0014BR.GOV.BCB.PIX';
    const chave = `01${pixKey.length.toString().padStart(2, '0')}${pixKey}`;
    const merchantAccount = `${gui}${chave}`;
    payload += `26${merchantAccount.length.toString().padStart(2, '0')}${merchantAccount}`;
    
    // Merchant Category Code
    payload += '52040000';
    
    // Transaction Currency (986 = BRL)
    payload += '5303986';
    
    // Transaction Amount
    payload += `54${valor.length.toString().padStart(2, '0')}${valor}`;
    
    // Country Code
    payload += '5802BR';
    
    // Merchant Name
    payload += `59${merchantName.length.toString().padStart(2, '0')}${merchantName}`;
    
    // Merchant City
    payload += `60${merchantCity.length.toString().padStart(2, '0')}${merchantCity}`;
    
    // Additional Data Field Template
    const txid = 'GILSON' + Date.now().toString().slice(-6);
    const additionalData = `05${txid.length.toString().padStart(2, '0')}${txid}`;
    payload += `62${additionalData.length.toString().padStart(2, '0')}${additionalData}`;
    
    // CRC16
    payload += '6304';
    const crc = this.calcularCRC16(payload);
    payload += crc;
    
    return payload;
  }

  calcularCRC16(payload: string): string {
    let crc = 0xFFFF;
    const bytes = new TextEncoder().encode(payload);
    
    for (let i = 0; i < bytes.length; i++) {
      crc ^= bytes[i] << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc = crc << 1;
        }
      }
    }
    
    crc = crc & 0xFFFF;
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  confirmarPagamentoPix() {
    this.toastr.success('Aguardando confirmação do pagamento...', 'Processando');
    setTimeout(() => {
      this.finalizarPedido();
    }, 2000);
  }

  finalizarPedido() {
    this.pedidosService.adicionarPedido({
      cliente: this.clienteForm.nome,
      email: this.clienteForm.email,
      telefone: this.clienteForm.telefone,
      endereco: this.clienteForm.endereco,
      itens: this.carrinho.length,
      produtos: [...this.carrinho],
      valor: this.valorTotalPedido
    });

    const mensagem = this.clienteForm.tipoEntrega === 'delivery' 
      ? 'Pedido enviado! Aguarde a aprovação para entrega.' 
      : 'Pedido enviado! Retire na loja após aprovação.';
    
    this.toastr.success(mensagem, 'Sucesso');
    this.carrinho = [];
    this.fecharModalFinalizar();
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
}
