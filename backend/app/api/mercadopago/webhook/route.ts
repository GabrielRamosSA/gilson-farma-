import { NextRequest, NextResponse } from 'next/server';
import mercadopago from '@/lib/mercadopago';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📨 Webhook recebido do Mercado Pago:', JSON.stringify(body, null, 2));

    if (body.type === 'payment' || body.action === 'payment.created' || body.action === 'payment.updated') {
      const paymentId = body.data?.id;

      if (!paymentId) {
        console.log('❌ Payment ID não encontrado no webhook');
        return NextResponse.json({ received: true });
      }

      console.log(`🔍 Buscando pagamento ID: ${paymentId}`);

      const paymentInfo = await mercadopago.payment.findById(paymentId);

      console.log(`💳 Status do pagamento: ${paymentInfo.body.status}`);

      if (paymentInfo.body.status === 'approved') {
        console.log('✅ Pagamento APROVADO!');
        // Aqui você pode criar o pedido automaticamente no banco
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
    
  } catch (error: any) {
    console.error('❌ Erro no webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'Webhook ativo' });
}
