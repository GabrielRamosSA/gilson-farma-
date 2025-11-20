import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoria = searchParams.get('categoria');
    const tipo = searchParams.get('tipo');

    const where: any = {};
    if (categoria && categoria !== 'Todos') {
      where.categoria = categoria;
    }
    if (tipo && tipo !== 'Todos') {
      where.tipo = tipo;
    }

    const produtos = await prisma.produto.findMany({
      where,
      orderBy: { nome: 'asc' }
    });

    return NextResponse.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const produto = await prisma.produto.create({
      data: {
        nome: body.nome,
        imagem: body.imagem,
        descricao: body.descricao,
        preco: body.preco,
        precoAntigo: body.precoAntigo || null,
        quantidade: body.quantidade,
        promocao: body.promocao || false,
        desconto: body.desconto || 0,
        tipo: body.tipo,
        categoria: body.categoria,
        palavrasChave: body.palavrasChave || []
      }
    });

    return NextResponse.json(produto, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    );
  }
}
