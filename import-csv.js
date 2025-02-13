import fs from 'fs'
import { parse } from 'csv-parse'

const filePath = './tasks.csv'

async function importCSV() {
  const stream = fs.createReadStream(filePath).pipe(parse({ delimiter: ',', fromLine: 2 }))

  for await (const record of stream) {
    const [title, description] = record

    if (!title || !description) continue //Valida se title/description são valores falsy

    try {
      const response = await fetch('http://localhost:3333/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      })

      if (!response.ok) {
        console.error(`Fail send task: ${title}`)
        continue
      }

      console.log(`Task "${title}" sended successfully.`)
    } catch (error) {
      console.error(`Fail send task: "${title}"`, error)
    }
  }

  console.log('Import completed.')
}

// Executa a importação
importCSV().catch(console.error)
