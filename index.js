import 'dotenv/config'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
const app = express()
const port = 3000



app.use(express.json())

// GET all posts (optional search)
app.get('/posts', async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm ?? ''
    const posts = await prisma.post.findMany({
        where: {
            title: {
                contains: String(searchTerm),
                mode: 'insensitive'
            }
        }
    })
    res.json(posts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET post by ID
app.get('/posts/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(req.params.id) }
    })

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.json(post)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// CREATE post
app.post('/posts', async (req, res) => {
  try {
    const { title, content, category } = req.body

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        createdat: new Date()
      }
    })

    res.status(201).json(post)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// UPDATE post
app.put('/posts/:id', async (req, res) => {
  try {
    const post = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: {
        ...req.body,
        updatedat: new Date()
      }
    })

    res.json(post)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE post
app.delete('/posts/:id', async (req, res) => {
  try {
    await prisma.post.delete({
      where: { id: Number(req.params.id) }
    })

    res.send('Post deleted')
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`)
})
