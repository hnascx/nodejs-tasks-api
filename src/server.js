import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async (req, res) => {
  // req desestruturado, retornando method e url
  const { method, url } = req 

  // aguarda o retorno da função json que recebe req e res
  await json(req, res)

  // verifica se a rota presente na requisição existe no array routes, se o method da rota corresponde ao method da requisição e se o path da rota corresponde ao path da requisição (o método test valida se a url segue as especificações definidas na função buildRoutePath). em seguida o valor é salvo em route
  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })


  if (route) {
    // parâmetros da rota capturados e salvos em routeParams
    const routeParams = req.url.match(route.path)

    // query e os demais parametros da rota desestruturados
    const { query, ...params } = routeParams.groups

    // req.params e req.query recebem os parâmetros e query da rota já convertida pela função extractQueryParams
    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    // req e res são passados para a rota e o handler executa a operação correspondente
    return route.handler(req, res)
  }

  // Se a rota não existir, responde com 404
  return res.writeHead(404).end('Page not found.')
})

server.listen(3333)