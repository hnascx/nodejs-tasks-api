export async function json(req, res) {
  // o array buffers armazena os pedaços de dados recebidos na requisição (chunks)
  const buffers = []

  // o for await itera sobre os chunks de forma assíncrona e armazena em buffers
  for await (const chunk of req) {
    buffers.push(chunk)
  }

  // os buffers armazenados são concatenados e convertidos em string, em sequência transformados em JSON e gravados em req.body

  //se a conversão falhar (por exemplo, se a string não for um JSON válido), req.body será definido como null
  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }

  // o Content-Type do cabeçalho da resposta será definido como application/json
  res.setHeader('Content-Type', 'application/json')
}