import db from '../../../../db'
import { Op } from 'sequelize'

export default async (req, res) => {
  if (typeof req.query.id !== 'string') return res.status(400).json({ err: 'badRequest' })

  // Get post
  const post = await db.Post.findOne({
    where: {
      id: req.query.id
    }
  })
  if (!post) return res.status(404).json({ err: 'missingResource' })

  // Response
  res.json({
    id: post.id,
    author: post.author,
    parent: post.parentId,
    children: [
      ...(
        await post.getChildren({
          where: {
            author: post.author
          },
          attributes: ['id'],
          order: [['createdAt', 'DESC']],
          limit: 100
        })
      ).map(p => p.id),
      ...(
        await post.getChildren({
          where: {
            author: {
              [Op.not]: post.author
            }
          },
          attributes: ['id'],
          order: [['createdAt', 'DESC']],
          limit: 100
        })
      ).map(p => p.id)
    ],
    content: post.content,
    image: post.image,
    createdAt: post.createdAt
  })
}
