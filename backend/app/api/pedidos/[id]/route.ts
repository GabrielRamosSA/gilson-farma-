import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: {
    id: string;
  };
};


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

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const id = context.params.id;
    const body = await request.json();

    console.log('🔄 Atualizando pedido:', id);
    console.log('Novo status:', body.status);

  
    if (body.status === 'aprovado') {
    
      const pedido = await prisma.pedido.findUnique({
        where: { id }
      });

      if (!pedido) {
        return NextResponse.json(
          { error: 'Pedido não encontrado' },
          { status: 404 }
        );
      }

      
      const produtos = pedido.produtos as any[];
      
      for (const item of produtos) {
       
        const produto = await prisma.produto.findFirst({
          where: { nome: item.nome }
        });

        if (produto) {
          const novaQuantidade = Math.max(0, produto.quantidade - item.quantidade);
          
          await prisma.produto.update({
            where: { id: produto.id },
            data: { quantidade: novaQuantidade }
          });

          console.log(`📦 Estoque atualizado: ${item.nome} - Quantidade anterior: ${produto.quantidade} → Nova: ${novaQuantidade}`);
        }
      }
    }

    const pedidoAtualizado = await prisma.pedido.update({
      where: { id },
      data: { 
        status: body.status,
        updatedAt: new Date()
      }
    });

    console.log('✅ Pedido atualizado com sucesso!');

    return NextResponse.json(pedidoAtualizado);
  } catch (error: any) {
    console.error('❌ Erro ao atualizar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar pedido', details: error.message },
      { status: 500 }
    );
  }
}


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
