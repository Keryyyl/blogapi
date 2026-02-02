import express from 'express'
import { PrismaClient } from '@prisma/client'
const app = express()
const prisma = new PrismaClient()
app.use(express.json())
const port = 3000

app.get('/posts', (req, res) => {
  res.send('Hello World!')
})
app.get('/posts', (req, res) => {
    const searchTerm = req.query.searchTerm ?? '';
    res.send('id: ' + req.query.searchTerm);
});

app.get('/posts/:id', async (req, res) => {
    const post = await prisma.post.findUnique({
        where: { id: Number(req.params.id) },
    });
    res.json(post);
})
app.post('/posts', (req, res) => {
    res.send('A new post has been created')
})
app.put('/posts/:id', (req, res) => {
    const postId = req.params.id
    res.send(`Post with id ${postId} has been updated`)
})
app.delete('/posts/:id', (req, res) => {
    const postId = req.params.id
    res.send(`Post with id ${postId} has been deleted`)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
