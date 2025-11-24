import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const fimHoje = new Date();
    fimHoje.setHours(23, 59, 59, 999);

    // Ontem
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);
    const fimOntem = new Date(ontem);
    fimOntem.setHours(23, 59, 59, 999);

    // Mês atual
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    
    // Mês anterior
    const inicioMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    const fimMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0, 23, 59, 59, 999);

    // Vendas de hoje
    const vendasHoje = await prisma.pedido.aggregate({
      where: {
        status: 'aprovado',
        createdAt: {
          gte: hoje,
          lte: fimHoje
        }
      },
      _sum: {
        valorTotal: true
      }
    });

    // Vendas de ontem
    const vendasOntem = await prisma.pedido.aggregate({
      where: {
        status: 'aprovado',
        createdAt: {
          gte: ontem,
          lte: fimOntem
        }
      },
      _sum: {
        valorTotal: true
      }
    });

    // Vendas do mês atual
    const vendasMes = await prisma.pedido.aggregate({
      where: {
        status: 'aprovado',
        createdAt: {
          gte: inicioMes
        }
      },
      _sum: {
        valorTotal: true
      }
    });

    // Vendas do mês anterior
    const vendasMesAnterior = await prisma.pedido.aggregate({
      where: {
        status: 'aprovado',
        createdAt: {
          gte: inicioMesAnterior,
          lte: fimMesAnterior
        }
      },
      _sum: {
        valorTotal: true
      }
    });

    const pedidosPendentes = await prisma.pedido.count({
      where: {
        status: 'pendente'
      }
    });

    const totalProdutos = await prisma.produto.count();

    // Cálculo das porcentagens
    const valorHoje = vendasHoje._sum.valorTotal || 0;
    const valorOntem = vendasOntem._sum.valorTotal || 0;
    
    const percentualVendasHoje = valorOntem > 0 
      ? ((valorHoje - valorOntem) / valorOntem) * 100 
      : valorHoje > 0 ? 100 : 0;

    const valorMesAtual = vendasMes._sum.valorTotal || 0;
    const valorMesAnterior = vendasMesAnterior._sum.valorTotal || 0;
    
    const percentualLucroMensal = valorMesAnterior > 0 
      ? ((valorMesAtual - valorMesAnterior) / valorMesAnterior) * 100 
      : valorMesAtual > 0 ? 100 : 0;

    // Lucro mensal (assumindo margem de 30%)
    const lucroMensal = valorMesAtual * 0.3;

    return NextResponse.json({
      vendasHoje: valorHoje,
      vendasMes: valorMesAtual,
      lucroMensal: lucroMensal,
      pedidosPendentes: pedidosPendentes,
      totalProdutos: totalProdutos,
      percentualVendasHoje: Math.round(percentualVendasHoje),
      percentualLucroMensal: Math.round(percentualLucroMensal)
    });
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas', details: error.message },
      { status: 500 }
    );
  }
}
