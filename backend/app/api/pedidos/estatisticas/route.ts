import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const fimHoje = new Date();
    fimHoje.setHours(23, 59, 59, 999);

    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

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

    const pedidosPendentes = await prisma.pedido.count({
      where: {
        status: 'pendente'
      }
    });

    const lucroMensal = (vendasMes._sum.valorTotal || 0) * 0.3;

    return NextResponse.json({
      vendasHoje: vendasHoje._sum.valorTotal || 0,
      vendasMes: vendasMes._sum.valorTotal || 0,
      lucroMensal: lucroMensal,
      pedidosPendentes: pedidosPendentes
    });
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas', details: error.message },
      { status: 500 }
    );
  }
}
