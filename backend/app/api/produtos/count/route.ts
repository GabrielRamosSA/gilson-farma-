import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const count = await prisma.produto.count();
    
    return NextResponse.json({ count });
  } catch (error: any) {
    console.error('Erro ao contar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao contar produtos' },
      { status: 500 }
    );
  }
}
