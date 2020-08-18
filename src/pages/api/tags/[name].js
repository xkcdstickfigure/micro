import db from '../../../db'
import { literal } from 'sequelize'

export default async (req, res) => {
  if (typeof req.query.name !== 'string') return res.status(400).json({ err: 'badRequest' })

  res.json({
    posts: (
      await db.Tag.findAll({
        where: {
          name: req.query.name
        },
        attributes: {
          include: [
            [
              literal('(select createdAt from posts where posts.id = postId)'),
              'createdAt'
            ]
          ]
        },
        order: [[literal('createdAt'), 'DESC']],
        limit: 100
      })
    ).map(p => p.postId)
  })
}
