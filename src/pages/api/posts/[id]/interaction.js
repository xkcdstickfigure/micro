import db from '../../../../db'
import { v4 as uuid } from 'uuid'
import auth from '../../../../utils/auth'

export default async (req, res) => {
  const user = await auth(req.cookies.sessionToken)
  if (!user) return res.status(401).json({ err: 'badAuthorization' })
  if (typeof req.query.id !== 'string') return res.status(400).json({ err: 'badRequest' })

  // Get post
  const post = await db.Post.findOne({
    where: {
      id: req.query.id
    }
  })
  if (!post) return res.status(404).json({ err: 'missingResource' })

  // Get interaction
  const interaction = await db.Interaction.findOne({
    where: {
      user: user.id,
      postId: post.id
    }
  })

  // Create if does not exist
  if (!interaction) {
    await db.Interaction.create({
      id: uuid(),
      user: user.id,
      postId: post.id,
      vote: 'neutral'
    })
  }

  // Response
  res.json({})
}
