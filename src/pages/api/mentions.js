import db from '../../db'
import { literal } from 'sequelize'
import auth from '../../utils/auth'

export default async (req, res) => {
  const user = await auth(req.cookies.sessionToken)
  if (!user) return res.status(401).send({ err: 'badAuthorization' })

  // Response
  res.json({
    posts: (
      await db.Mention.findAll({
        where: {
          user: user.id
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
