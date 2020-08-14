import auth from '../../../utils/auth'
import { v4 as uuid } from 'uuid'
import db from '../../../db'
import config from '../../../config'

export default async (req, res) => {
  const user = await auth(req.cookies.sessionToken)
  if (!user) return res.status(401).send({ err: 'badAuthorization' })

  const { content, parent: parentId } = req.body
  if (typeof content !== 'string') return res.status(400).json({ err: 'badRequest' })
  if (
    content.length < 1 ||
    content.length > config.maxPostLength
  ) return res.status(400).json({ err: 'micro.post.length' })

  // Verify Parent
  let parent
  if (typeof parentId === 'string') {
    parent = await db.Post.findOne({
      where: {
        id: parentId
      }
    })
    if (!parent) return res.status(400).json({ err: 'micro.post.parent' })
  }

  // Create post
  const post = await db.Post.create({
    id: uuid(),
    author: user.id,
    alles: true,
    content,
    score: 0,
    parentId: parent ? parent.id : null
  })

  // Response
  res.json({ id: post.id })
}
