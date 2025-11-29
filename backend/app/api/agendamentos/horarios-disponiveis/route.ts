import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dataStr = searchParams.get('data');

    if (!dataStr) {
      return NextResponse.json(
        { error: 'Data é obrigatória' },
        { status: 400 }
      );
    }

    const data = new Date(dataStr);
    
    const agendamentos = await prisma.agendamento.findMany({
      where: {
        data: {
          gte: new Date(data.setHours(0, 0, 0, 0)),
          lte: new Date(data.setHours(23, 59, 59, 999))
        },
        status: 'ATIVO'
      }
    });

    const horariosOcupados = agendamentos.map(a => a.horario);
    const todosHorarios = [
      '08:00', '09:00', '10:00', '11:00',
      '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    const horariosDisponiveis = todosHorarios.filter(
      h => !horariosOcupados.includes(h)
    );

    return NextResponse.json({ horariosDisponiveis }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error: any) {
    console.error('Erro ao buscar horários:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar horários' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
