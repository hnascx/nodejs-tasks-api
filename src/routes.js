import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { getFormattedDateFromNow } from './utils/get-formatted-date-from-now.js'

const database = new Database()

const formattedDate = () => getFormattedDateFromNow()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed: false,
        created_at: formattedDate(),
        updated_at: formattedDate(),
        completed_at: null
      }

      database.insert('tasks', task)

      return res.writeHead(201).end('Task created successfully.')
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      const tasks = database.select('tasks')
      const task = tasks.find(task => task.id === id)

      if (!task) {
        return res.writeHead(404).end('Task not found.')
      }

      const isCompleted = !task.completed

      database.update('tasks', id, {
        ...task,
        completed: isCompleted,
        completed_at: isCompleted ? formattedDate() : null,
        updated_at: formattedDate()
      })

      return res.writeHead(200).end('Task status updated successfully.')
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const tasks = database.select('tasks')
      const task = tasks.find(task => task.id === id)

      if (!task) {
        return res.writeHead(404).end('Task not found.')
      }

      database.update('tasks', id, {
        ...task,
        title,
        description,
        updated_at: formattedDate()
      })

      return res.writeHead(200).end('Task updated successfully.')
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(200).end('Task deleted successfully.')
    }
  }
]
