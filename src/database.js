import fs from 'node:fs/promises'

// importando o caminho do banco de dados
const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {} // objeto que armazena o banco de dados (hash para tornar a propriedade privada)

  // método responsável por ler o banco de dados e gravar os novos registros no arquivo db.json. caso o arquivo não exista, ele cria chamando o método #persist
  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  // método esponsável por escrever o banco de dados em um arquivo. chamado sempre que uma nova informação é inserida no banco de dados.
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? [] // valida se a tabela existe

    // realiza a busca por query no banco de dados
    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  insert(table, data) {

    // Se já existe uma tabela (array) presente no objeto database (banco de dados), seleciona essa tabela (array) e adiciona o data (dados). Se não existe, cria a tabela (array) e adiciona o data (dados).

    if (Array.isArray(this.#database[table])) { 
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data }
      this.#persist()
    }
  }
  
  delete(table, id) {
    // Percorre o json do arquivo db.json e verifica se o id recebido existe nos ids presentes no json
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }
}