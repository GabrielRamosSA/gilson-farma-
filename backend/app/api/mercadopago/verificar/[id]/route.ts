import { NextRequest, NextResponse } from 'next/server';
import mercadopago from '@/lib/mercadopago';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const payment = await mercadopago.payment.findById(parseInt(id));

    return NextResponse.json({
      id: payment.body.id,
      status: payment.body.status,
      status_detail: payment.body.status_detail,
      transaction_amount: payment.body.transaction_amount
    });

  } catch (error: any) {
    console.error('Erro ao verificar pagamento:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar pagamento' },
      { status: 500 }
    );
  }
}
