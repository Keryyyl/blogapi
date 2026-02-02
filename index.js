import express from 'express'
import { PrismaClient } from '@prisma/client'
const app = express()
const prisma = new PrismaClient()
app.use(express.json())
const port = 3000

// Get all posts
app.post('/posts', async (req, res) => {
  const post = await prisma.post.create({
    data: {
      title: req.body.title,
      content: req.body.content
    }
  })
  res.status(201).json(post)
})

// Get all posts with optional search term
app.get('/posts', async (req, res) => {
  const searchTerm = req.query.searchTerm ?? ''
  const posts = await prisma.post.findMany({
    where: {
      title: {
        contains: searchTerm,
        mode: 'insensitive'
      }
    }
})
  res.json(posts)
})

// Get a single post by ID
app.get('/posts/:id', async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: Number(req.params.id) }
  })

  res.json(post)
})

// Create a new post
app.post('/posts', async (req, res) => {
  const post = await prisma.post.create({
    data: {
      title: req.body.title,
      content: req.body.content
    }
  })
  res.status(201).json(post)
})

// Update a post by ID
app.put('/posts/:id', async (req, res) => {
  const post = await prisma.post.update({
    where: { id: Number(req.params.id) },
    data: req.body
  })
  res.json(post)
})

// Delete a post by ID
app.delete('/posts/:id', async (req, res) => {
  await prisma.post.delete({
    where: { id: Number(req.params.id) }
  })
  res.send('Post deleted')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
