import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] 
})
export class MedicamentosComponent {
  
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
  
  constructor(
    private router: Router, 
    private toastr: ToastrService,
    private pedidosService: PedidosService
  ) {}

  produtos = [
    // ====== MEDICAMENTOS ======
    {
      nome: "Annita 20mg",
      imagem: "/medicamentos/Annita.png",
      descricao: "Antiparasitário de amplo espectro para tratamento de verminoses intestinais e giardíase.",
      preco: "R$ 15,90",
      precoAntigo: "",
      quantidade: 10,
      promocao: false,
      desconto: 0,
      tipo: "Genéricos",
      categoria: "Medicamentos",
      palavrasChave: ["annita", "verme", "antiparasitario", "giardíase", "verminose", "intestinal"]
    },
    {
      nome: "Paracetamol 500mg",
      imagem: "/medicamentos/Paracetamol.png",
      descricao: "Analgésico e antitérmico para dores e febres.",
      preco: "R$ 9,90",
      precoAntigo: "R$ 12,90",
      quantidade: 0,
      promocao: true,
      desconto: 23,
      tipo: "Genéricos",
      categoria: "Medicamentos",
      palavrasChave: ["paracetamol", "analgesico", "dor", "febre", "acetaminofeno"]
    },
    {
      nome: "Dipirona Sódica 1g",
      imagem: "/medicamentos/DipironaSodica.png",
      descricao: "Analgésico e antipirético para alívio de dor e febre.",
      preco: "R$ 7,50",
      precoAntigo: "", 
      quantidade: 40,
      promocao: false,
      desconto: 0,
      tipo: "Genéricos",
      categoria: "Medicamentos",
      palavrasChave: ["dipirona", "analgesico", "dor", "febre", "metamizol"]
    },
    {
      nome: "Ibuprofeno 600mg",
      imagem: "/medicamentos/Ibuprofeno.png",
      descricao: "Anti-inflamatório, analgésico e antitérmico.",
      preco: "R$ 14,90",
      precoAntigo: "R$ 18,90",
      quantidade: 30,
      promocao: true,
      desconto: 21,
      tipo: "Referência", 
      categoria: "Medicamentos",
      palavrasChave: ["ibuprofeno", "anti-inflamatorio", "dor", "inflamacao", "artrite"]
    },
    {
      nome: "Amoxicilina 500mg",
      imagem: "/medicamentos/Amoxicilina.png",
      descricao: "Antibiótico para infecções bacterianas.",
      preco: "R$ 19,90",
      precoAntigo: "",
      quantidade: 20,
      promocao: false,
      desconto: 0,
      tipo: "Similares",
      categoria: "Medicamentos",
      palavrasChave: ["amoxicilina", "antibiotico", "infeccao", "bacteria", "penicilina"]
    },
    {
      nome: "Azitromicina 500mg",
      imagem: "/medicamentos/Azitromicina.png",
      descricao: "Antibiótico de amplo espectro.",
      preco: "R$ 22,50",
      precoAntigo: "R$ 29,90",
      quantidade: 15,
      promocao: true,
      desconto: 25,
      tipo: "Referência",
      categoria: "Medicamentos",
      palavrasChave: ["azitromicina", "antibiotico", "infeccao", "respiratoria", "zitromax"]
    },
    {
      nome: "Losartana Potássica 50mg",
      imagem: "/medicamentos/LosartanaPotassica.png",
      descricao: "Antihipertensivo para controle da pressão arterial.",
      preco: "R$ 18,90",
      precoAntigo: "",
      quantidade: 40,
      promocao: false,
      desconto: 0,
      tipo: "Genéricos",
      categoria: "Medicamentos",
      palavrasChave: ["losartana", "pressao", "hipertensao", "cardiovascular", "coração"]
    },
    {
      nome: "Omeprazol 20mg",
      imagem: "/medicamentos/Omeprazol.png",
      descricao: "Inibidor de bomba de prótons para problemas gástricos.",
      preco: "R$ 12,90",
      precoAntigo: "R$ 16,90",
      quantidade: 35,
      promocao: true,
      desconto: 24,
      tipo: "Similares",
      categoria: "Medicamentos",
      palavrasChave: ["omeprazol", "gastrite", "azia", "estomago", "refluxo"]
    },
    {
      nome: "Cetirizina 10mg",
      imagem: "/medicamentos/Cetirizina.png",
      descricao: "Antialérgico para alívio de sintomas alérgicos.",
      preco: "R$ 8,90",
      precoAntigo: "",
      quantidade: 22,
      promocao: false,
      desconto: 0,
      tipo: "Genéricos",
      categoria: "Medicamentos",
      palavrasChave: ["cetirizina", "alergia", "antialergico", "rinite", "urticaria"]
    },
    {
      nome: "Cloridrato de Sertralina 50mg",
      imagem: "/medicamentos/CloridratodeSertralina.png",
      descricao: "Antidepressivo ISRS para tratamento de depressão e ansiedade.",
      preco: "R$ 29,90",
      precoAntigo: "",
      quantidade: 12,
      promocao: false,
      desconto: 0,
      tipo: "Referência",
      categoria: "Medicamentos",
      palavrasChave: ["sertralina", "antidepressivo", "depressao", "ansiedade", "zoloft"]
    },
    {
      nome: "Fluoxetina 20mg",
      imagem: "/medicamentos/Fluoxetina.png",
      descricao: "Antidepressivo ISRS para tratamento de depressão, transtorno de ansiedade, bulimia e TOC.",
      preco: "R$ 24,90",
      precoAntigo: "R$ 32,90",
      quantidade: 18,
      promocao: true,
      desconto: 24,
      tipo: "Similares",
      categoria: "Medicamentos",
      palavrasChave: ["fluoxetina", "antidepressivo", "depressao", "ansiedade", "prozac"]
    },
    {
      nome: "Metformina 850mg",
      imagem: "/medicamentos/Metformina.png",
      descricao: "Antidiabético oral para controle de diabetes tipo 2.",
      preco: "R$ 20,90",
      precoAntigo: "R$ 26,90",
      quantidade: 33,
      promocao: true,
      desconto: 22,
      tipo: "Referência",
      categoria: "Medicamentos",
      palavrasChave: ["metformina", "diabetes", "glicose", "acucar", "diabetico"]
    },
    {
      nome: "Enalapril 10mg",
      imagem: "/medicamentos/Enalapril.png",
      descricao: "Inibidor da ECA para tratamento de hipertensão arterial.",
      preco: "R$ 15,90",
      precoAntigo: "",
      quantidade: 17,
      promocao: false,
      desconto: 0,
      tipo: "Similares",
      categoria: "Medicamentos",
      palavrasChave: ["enalapril", "pressao", "hipertensao", "cardiovascular", "ace"]
    },
    {
      nome: "Captopril 25mg",
      imagem: "/medicamentos/Captopril.png",
      descricao: "Inibidor da ECA para tratamento de hipertensão arterial.",
      preco: "R$ 13,90",
      precoAntigo: "",
      quantidade: 29,
      promocao: false,
      desconto: 0,
      tipo: "Genéricos",
      categoria: "Medicamentos",
      palavrasChave: ["captopril", "pressao", "hipertensao", "cardiovascular", "ace"]
    },

    // ========== VITAMINAS ==========
    {
      nome: "Vitamina D3 2000UI",
      imagem: "/vitaminas/VitaminaD3.png",
      descricao: "Suplemento vitamínico para fortalecimento ósseo e imunidade.",
      preco: "R$ 35,90",
      precoAntigo: "R$ 42,90",
      quantidade: 45,
      promocao: true,
      desconto: 16,
      tipo: "Suplementos", 
      categoria: "Vitaminas",
      palavrasChave: ["vitamina d", "ossos", "calcio", "imunidade", "suplemento"]
    },
    {
      nome: "Complexo B",
      imagem: "/vitaminas/ComplexoB.png",
      descricao: "Complexo de vitaminas do grupo B para energia e sistema nervoso.",
      preco: "R$ 28,90",
      precoAntigo: "",
      quantidade: 38,
      promocao: false,
      desconto: 0,
      tipo: "Suplementos",
      categoria: "Vitaminas",
      palavrasChave: ["complexo b", "vitamina b", "energia", "nervoso", "metabolismo"]
    },
    {
      nome: "Vitamina C 1000mg",
      imagem: "/vitaminas/VitaminaC.png",
      descricao: "Poderoso antioxidante para fortalecimento da imunidade.",
      preco: "R$ 24,90",
      precoAntigo: "R$ 31,90",
      quantidade: 52,
      promocao: true,
      desconto: 22,
      tipo: "Suplementos",
      categoria: "Vitaminas",
      palavrasChave: ["vitamina c", "imunidade", "antioxidante", "gripe", "resfriado"]
    },
    {
      nome: "Ômega 3 1000mg",
      imagem: "/vitaminas/Omega3.png",
      descricao: "Suplemento de ácidos graxos essenciais para saúde cardiovascular.",
      preco: "R$ 45,90",
      precoAntigo: "",
      quantidade: 28,
      promocao: false,
      desconto: 0,
      tipo: "Suplementos",
      categoria: "Vitaminas",
      palavrasChave: ["omega 3", "cardiovascular", "coracao", "colesterol", "cerebro"]
    },
    {
      nome: "Ferro Quelato",
      imagem: "/vitaminas/FerroQuelato.png",
      descricao: "Suplemento de ferro para tratamento e prevenção de anemia.",
      preco: "R$ 32,90",
      precoAntigo: "R$ 38,90",
      quantidade: 26,
      promocao: true,
      desconto: 15,
      tipo: "Suplementos",
      categoria: "Vitaminas",
      palavrasChave: ["ferro", "anemia", "sangue", "cansaço", "energia"]
    },
    {
      nome: "Magnésio Dimalato",
      imagem: "/vitaminas/MagnesioDimalato.png",
      descricao: "Suplemento de magnésio para músculos e sistema nervoso.",
      preco: "R$ 39,90",
      precoAntigo: "",
      quantidade: 31,
      promocao: false,
      desconto: 0,
      tipo: "Suplementos",
      categoria: "Vitaminas",
      palavrasChave: ["magnesio", "musculos", "caibras", "sono", "relaxante"]
    },

    {
      nome: "Vitamina AD Gotas",
      imagem: "/vitaminas/VitaminaAD.png",
      descricao: "Suplemento vitamínico AD para desenvolvimento infantil.",
      preco: "R$ 18,90",
      precoAntigo: "",
      quantidade: 42,
      promocao: false,
      desconto: 0,
      tipo: "Suplementos",
      categoria: "Vitaminas",
      palavrasChave: ["vitamina ad", "gotas", "desenvolvimento", "ossos", "visao"]
    },
    // ========== PRODUTOS INFANTIS ==========
    {
      nome: "Paracetamol Infantil Gotas",
      imagem: "/ProdutosInfantis/ParacetamolInfantil.png", 
      descricao: "Analgésico e antitérmico infantil em gotas, sabor morango.",
      preco: "R$ 12,90",
      precoAntigo: "",
      quantidade: 35,
      promocao: false,
      desconto: 0,
      tipo: "Infantil", 
      categoria: "Infantil",
      palavrasChave: ["paracetamol infantil", "gotas", "febre", "dor", "crianca", "bebe"]
    },

    {
      nome: "Polivitamínico Infantil",
      imagem: "/ProdutosInfantis/PolivitaminicoInfantil.png",
      descricao: "Complexo vitamínico completo para crianças, sabor uva.",
      preco: "R$ 26,90",
      precoAntigo: "R$ 32,90",
      quantidade: 19,
      promocao: true,
      desconto: 18,
      tipo: "Infantil",
      categoria: "Infantil",
      palavrasChave: ["polivitaminico", "vitaminas", "crescimento", "desenvolvimento", "crianca"]
    },

    // ========== PRODUTOS DE HIGIENE ==========
    {
      nome: "Sabonete Antisséptico",
      imagem: "/higiene/SaboneteAntisseptico.png",
      descricao: "Sabonete líquido antisséptico para higiene das mãos.",
      preco: "R$ 15,90",
      precoAntigo: "",
      quantidade: 48,
      promocao: false,
      desconto: 0,
      tipo: "Higiene",
      categoria: "Higiene",
      palavrasChave: ["sabonete", "antisseptico", "maos", "limpeza", "bacterias"]
    },
    {
      nome: "Álcool em Gel 70%",
      imagem: "/higiene/AlcoolGel.png",
      descricao: "Álcool em gel 70% para higienização das mãos.",
      preco: "R$ 12,90",
      precoAntigo: "R$ 16,90",
      quantidade: 72,
      promocao: true,
      desconto: 24,
      tipo: "Higiene",
      categoria: "Higiene",
      palavrasChave: ["alcool gel", "higienizacao", "maos", "70%", "antisseptico"]
    },
    {
      nome: "Lenços Umedecidos",
      imagem: "/higiene/LencosUmedecidos.png",
      descricao: "Lenços umedecidos antibacterianos com 100 unidades.",
      preco: "R$ 9,90",
      precoAntigo: "",
      quantidade: 35,
      promocao: false,
      desconto: 0,
      tipo: "Higiene",
      categoria: "Higiene",
      palavrasChave: ["lencos umedecidos", "antibacteriano", "limpeza", "pratico"]
    },
    {
      nome: "Shampoo Anticaspa",
      imagem: "/higiene/ShampooAnticaspa.png",
      descricao: "Shampoo medicinal anticaspa com sulfeto de selênio.",
      preco: "R$ 22,90",
      precoAntigo: "R$ 28,90",
      quantidade: 24,
      promocao: true,
      desconto: 21,
      tipo: "Higiene",
      categoria: "Higiene",
      palavrasChave: ["shampoo", "anticaspa", "cabelo", "dermatite", "couro cabeludo"]
    },
    {
      nome: "Sabonete Íntimo Feminino",
      imagem: "/higiene/SaboneteIntimo.png",
      descricao: "Sabonete líquido para higiene íntima feminina pH balanceado.",
      preco: "R$ 18,90",
      precoAntigo: "",
      quantidade: 31,
      promocao: false,
      desconto: 0,
      tipo: "Higiene",
      categoria: "Higiene",
      palavrasChave: ["sabonete intimo", "feminino", "ph", "higiene", "mulher"]
    },

    // ========== COSMÉTICOS ==========
    {
      nome: "Protetor Solar FPS 60",
      imagem: "/cosmeticos/ProtetorSolar.png",
      descricao: "Protetor solar facial FPS 60 com base aquosa.",
      preco: "R$ 45,90",
      precoAntigo: "R$ 55,90",
      quantidade: 28,
      promocao: true,
      desconto: 18,
      tipo: "Cosméticos",
      categoria: "Cosméticos",
      palavrasChave: ["protetor solar", "fps 60", "facial", "sol", "protecao"]
    },
    {
      nome: "Hidratante Corporal",
      imagem: "/cosmeticos/HidratanteCorporal.png",
      descricao: "Loção hidratante corporal com ureia para pele seca.",
      preco: "R$ 32,90",
      precoAntigo: "",
      quantidade: 22,
      promocao: false,
      desconto: 0,
      tipo: "Cosméticos",
      categoria: "Cosméticos",
      palavrasChave: ["hidratante", "corporal", "pele seca", "ureia", "hidratacao"]
    },
    {
      nome: "Sérum Vitamina C",
      imagem: "/cosmeticos/SerumVitaminaC.png",
      descricao: "Sérum facial antioxidante com vitamina C pura 15%.",
      preco: "R$ 68,90",
      precoAntigo: "R$ 85,90",
      quantidade: 15,
      promocao: true,
      desconto: 20,
      tipo: "Cosméticos",
      categoria: "Cosméticos",
      palavrasChave: ["serum", "vitamina c", "facial", "antioxidante", "anti-idade"]
    },
    {
      nome: "Base Líquida FPS 30",
      imagem: "/cosmeticos/BaseLiquida.png",
      descricao: "Base líquida com proteção solar FPS 30, cobertura natural.",
      preco: "R$ 39,90",
      precoAntigo: "",
      quantidade: 18,
      promocao: false,
      desconto: 0,
      tipo: "Cosméticos",
      categoria: "Cosméticos",
      palavrasChave: ["base liquida", "fps 30", "maquiagem", "cobertura", "protetor"]
    },
    {
      nome: "Máscara Facial Hidratante",
      imagem: "/cosmeticos/MascaraFacial.png",
      descricao: "Máscara facial hidratante com ácido hialurônico.",
      preco: "R$ 25,90",
      precoAntigo: "R$ 32,90",
      quantidade: 33,
      promocao: true,
      desconto: 21,
      tipo: "Cosméticos",
      categoria: "Cosméticos",
      palavrasChave: ["mascara facial", "hidratante", "acido hialuronico", "skincare"]
    },

    // Bucal
    {
      nome: "Enxaguante Bucal Antisséptico",
      imagem: "/bucal/EnxaguanteBucal.png",
      descricao: "Enxaguante bucal antisséptico sem álcool, 500ml.",
      preco: "R$ 16,90",
      precoAntigo: "",
      quantidade: 42,
      promocao: false,
      desconto: 0,
      tipo: "Bucal",
      categoria: "Bucal",
      palavrasChave: ["enxaguante", "bucal", "antisseptico", "halitose", "gengivite"]
    },
    {
      nome: "Creme Dental Branqueador",
      imagem: "/bucal/CremeDental.png",
      descricao: "Creme dental branqueador com flúor e bicarbonato.",
      preco: "R$ 8,90",
      precoAntigo: "R$ 11,90",
      quantidade: 58,
      promocao: true,
      desconto: 25,
      tipo: "Bucal",
      categoria: "Bucal",
      palavrasChave: ["creme dental", "branqueador", "fluor", "bicarbonato", "dentes"]
    },
    {
      nome: "Fio Dental com Flúor",
      imagem: "/bucal/FioDental.png",
      descricao: "Fio dental encerado com flúor para limpeza interdental.",
      preco: "R$ 6,90",
      precoAntigo: "",
      quantidade: 67,
      promocao: false,
      desconto: 0,
      tipo: "Bucal",
      categoria: "Bucal",
      palavrasChave: ["fio dental", "fluor", "limpeza", "interdental", "higiene"]
    },
    {
      nome: "Spray Antisséptico Oral",
      imagem: "/bucal/SprayOral.png",
      descricao: "Spray antisséptico oral para hálito fresco instantâneo.",
      preco: "R$ 12,90",
      precoAntigo: "",
      quantidade: 29,
      promocao: false,
      desconto: 0,
      tipo: "Bucal",
      categoria: "Bucal",
      palavrasChave: ["spray oral", "antisseptico", "halito", "fresco", "portatil"]
    },
    {
      nome: "Gel Dental Sensibilidade",
      imagem: "/bucal/GelDental.png",
      descricao: "Gel dental para dentes sensíveis com nitrato de potássio.",
      preco: "R$ 14,90",
      precoAntigo: "R$ 18,90",
      quantidade: 21,
      promocao: true,
      desconto: 21,
      tipo: "Bucal",
      categoria: "Bucal",
      palavrasChave: ["gel dental", "sensibilidade", "dentes sensiveis", "nitrato potassio"]
    }
  ];

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
      const palavrasChaveMatch = produto.palavrasChave.some(palavra => 
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
