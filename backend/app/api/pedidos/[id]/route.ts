import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: {
    id: string;
  };
};

// GET - Buscar pedido por ID
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const id = context.params.id;

    const pedido = await prisma.pedido.findUnique({
      where: { id }
    });

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(pedido);
  } catch (error: any) {
    console.error('Erro ao buscar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedido' },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar status do pedido
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const id = context.params.id;
    const body = await request.json();

    console.log('🔄 Atualizando pedido:', id);
    console.log('Novo status:', body.status);

    const pedido = await prisma.pedido.update({
      where: { id },
      data: { 
        status: body.status,
        updatedAt: new Date()
      }
    });

    console.log('✅ Pedido atualizado com sucesso!');

    return NextResponse.json(pedido);
  } catch (error: any) {
    console.error('❌ Erro ao atualizar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar pedido', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Deletar pedido
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const id = context.params.id;

    await prisma.pedido.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Pedido deletado com sucesso' });
  } catch (error: any) {
    console.error('Erro ao deletar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar pedido' },
      { status: 500 }
    );
  }
}
