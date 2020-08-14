import db from '../../db'
import { Op, literal } from 'sequelize'
import auth from '../../utils/auth'

export default async (req, res) => {
  const user = await auth(req.cookies.sessionToken)
  if (!user) return res.status(401).send({ err: 'badAuthorization' })

  res.json({
    posts: (
      await db.Post.findAll({
        where: {
          [Op.or]: [
            {
              author: {
                [Op.in]: literal(
                  // Yeah, I know, this doesn't look very safe but I spent hours trying to
                  // find a better solution. Sequelize doesn't seem to support replacements in
                  // literals here, and user ids will always be UUIDs, so it's good enough :/
                  `(select following from followers where user = "${user.id}")`
                )
              }
            },
            {
              author: user.id
            }
          ],
          parentId: null,
          createdAt: {
            [Op.gt]: new Date().getTime() - 1000 * 60 * 60 * 24 * 2
          }
        },
        attributes: ['id'],
        order: [['createdAt', 'DESC']],
        limit: 10
      })
    ).map(p => p.id)
  })
}
