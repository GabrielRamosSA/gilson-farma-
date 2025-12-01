import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.produto.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'Produto removido com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    return NextResponse.json(
      { error: 'Erro ao remover produto' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const produto = await prisma.produto.findUnique({
      where: { id }
    });

    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produto' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: {
        nome: body.nome,
        imagem: body.imagem,
        descricao: body.descricao,
        preco: body.preco,
        precoAntigo: body.precoAntigo,
        quantidade: body.quantidade,
        promocao: body.promocao,
        desconto: body.desconto,
        tipo: body.tipo,
        categoria: body.categoria,
        palavrasChave: body.palavrasChave,
      }
    });

    return NextResponse.json({
      message: 'Produto atualizado com sucesso',
      produto: produtoAtualizado
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    );
  }
}
