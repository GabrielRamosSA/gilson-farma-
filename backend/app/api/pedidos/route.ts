import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Buscar todos os pedidos
export async function GET(request: NextRequest) {
  try {
    const pedidos = await prisma.pedido.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(pedidos);
  } catch (error: any) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    );
  }
}

// POST - Criar novo pedido
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const pedido = await prisma.pedido.create({
      data: {
        cliente: body.cliente,
        email: body.email,
        telefone: body.telefone,
        endereco: body.endereco || '',
        tipoEntrega: body.tipoEntrega || 'retirada',
        metodoPagamento: body.metodoPagamento || 'dinheiro',
        produtos: body.produtos,
        valorTotal: body.valor,
        status: 'pendente'
      }
    });

    return NextResponse.json(pedido, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao criar pedido', details: error.message },
      { status: 500 }
    );
  }
}
