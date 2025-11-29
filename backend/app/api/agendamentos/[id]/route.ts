import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: {
    id: string;
  };
};

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const id = context.params.id;
    const body = await request.json();

    const agendamento = await prisma.agendamento.update({
      where: { id },
      data: { 
        status: body.status,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(agendamento);
  } catch (error: any) {
    console.error('Erro ao atualizar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar agendamento' },
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

    await prisma.agendamento.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Agendamento deletado com sucesso' });
  } catch (error: any) {
    console.error('Erro ao deletar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar agendamento' },
      { status: 500 }
    );
  }
}
