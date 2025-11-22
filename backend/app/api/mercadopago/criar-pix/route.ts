import { NextRequest, NextResponse } from 'next/server';
import mercadopago from '@/lib/mercadopago';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📝 Criando pagamento PIX com Mercado Pago...');
    console.log('Valor:', body.transaction_amount);
    console.log('Email:', body.payer.email);

    const payment_data = {
      transaction_amount: Number(body.transaction_amount),
      description: body.description,
      payment_method_id: 'pix',
      payer: {
        email: body.payer.email,
        first_name: body.payer.first_name,
        last_name: body.payer.last_name || '',
        identification: {
          type: 'CPF',
          number: '08336053301' // CPF do farmacêutico
        }
      }
    };

    console.log('📤 Enviando requisição para Mercado Pago...');

    const response = await mercadopago.payment.create(payment_data);

    console.log('✅ Resposta do Mercado Pago:', response.status);
    console.log('Payment ID:', response.body.id);

    if (!response.body.point_of_interaction?.transaction_data) {
      throw new Error('Mercado Pago não retornou os dados do PIX');
    }

    return NextResponse.json({
      id: response.body.id,
      status: response.body.status,
      qr_code: response.body.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: response.body.point_of_interaction.transaction_data.qr_code_base64,
      ticket_url: response.body.point_of_interaction.transaction_data.ticket_url
    });

  } catch (error: any) {
    console.error('❌ Erro detalhado:', error);
    console.error('Response:', error.response?.data);
    console.error('Status:', error.status);
    
    return NextResponse.json(
      { 
        error: 'Erro ao criar pagamento PIX', 
        details: error.message,
        cause: error.cause,
        status: error.status
      },
      { status: 500 }
    );
  }
}
