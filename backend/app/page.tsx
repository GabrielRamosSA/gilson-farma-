export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Gilson Farma API</h1>
      <p>Backend rodando com sucesso!</p>
      <h2>Endpoints disponíveis:</h2>
      <ul>
        <li><code>GET /api/produtos</code> - Listar produtos</li>
        <li><code>POST /api/produtos</code> - Criar produto</li>
        <li><code>POST /api/produtos/seed</code> - Popular banco de dados</li>
      </ul>
    </div>
  )
}
