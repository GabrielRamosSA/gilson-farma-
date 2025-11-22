import { NextRequest, NextResponse } from 'next/server';
import { mercadopago } from '@/lib/mercadopago';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Webhook recebido:', body);

    // Verificar o tipo de notificação
    if (body.type === 'payment') {
      const paymentId = body.data.id;
      
      // Buscar informações do pagamento
      const payment = await mercadopago.payment.findById(paymentId);
      
      console.log('Status do pagamento:', payment.body.status);
      console.log('Referência externa:', payment.body.external_reference);

      // Aqui você pode atualizar o pedido no banco de dados
      // Exemplo: await prisma.pedido.update(...)

      switch (payment.body.status) {
        case 'approved':
          console.log('✅ Pagamento aprovado!');
          break;
        case 'pending':
          console.log('⏳ Pagamento pendente');
          break;
        case 'rejected':
          console.log('❌ Pagamento rejeitado');
          break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Erro no webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}
