import { NextRequest, NextResponse } from 'next/server';
import { mercadopago } from '@/lib/mercadopago';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const preference = {
      items: body.items.map((item: any) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: 'BRL'
      })),
      payer: {
        name: body.payer.name,
        email: body.payer.email,
        phone: {
          number: body.payer.phone
        }
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:4200'}/pagamento/sucesso`,
        failure: `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:4200'}/pagamento/falha`,
        pending: `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:4200'}/pagamento/pendente`
      },
      auto_return: 'approved' as const,
      notification_url: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/pagamento/webhook`,
      statement_descriptor: 'GILSON FARMA',
      external_reference: `ORDER_${Date.now()}`
    };

    const response = await mercadopago.preferences.create(preference);

    return NextResponse.json({
      id: response.body.id,
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point
    });

  } catch (error: any) {
    console.error('Erro ao criar preferência de pagamento:', error);
    return NextResponse.json(
      { error: 'Erro ao criar pagamento', details: error.message },
      { status: 500 }
    );
  }
}
