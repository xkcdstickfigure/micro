import db from '../../../../db'
import { Op } from 'sequelize'
import auth from '../../../../utils/auth'
import getUser from '../../../../utils/getUser'
import parseContent from '../../../../utils/parseContent'

export default async (req, res) => {
  const user = await auth(req.cookies.sessionToken)
  if (typeof req.query.id !== 'string') return res.status(400).json({ err: 'badRequest' })

  // Get post
  const post = await db.Post.findOne({
    where: {
      id: req.query.id
    }
  })
  if (!post) return res.status(404).json({ err: 'missingResource' })

  // Get upvotes
  const upvotes = await db.Interaction.count({
    where: {
      postId: post.id,
      vote: 'up'
    }
  })

  // Get downvotes
  const downvotes = await db.Interaction.count({
    where: {
      postId: post.id,
      vote: 'down'
    }
  })

  // Get interaction
  const interaction = user ? (
    await db.Interaction.findOne({
      where: {
        user: user.id,
        postId: post.id
      }
    })
  ) : null

  // Get referenced user data
  const referencedUsers = (await Promise.all(
    parseContent(post.content)
      .filter(segment => (
        segment.type === 'user' &&
        segment.string.length === 36
      ))
      .map(({ string: id }) => getUser(id))
  )).filter(u => !!u)

  // Names
  const names = {}
  referencedUsers.forEach(({ user: u }) => { names[u.id] = u.name })

  // Response
  res.json({
    id: post.id,
    author: post.author,
    parent: post.parentId,
    children: {
      list: [
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
      count: await post.countChildren()
    },
    content: post.content,
    image: post.image,
    vote: {
      score: upvotes - downvotes,
      me: user ? (
        interaction ? ['down', 'neutral', 'up'].indexOf(interaction.vote) - 1 : 0
      ) : null
    },
    interactions: user && user.id === post.author ? (
      await db.Interaction.count({
        where: {
          postId: post.id
        }
      })
    ) : null,
    createdAt: post.createdAt,
    mentions: (await post.getMentions({ attributes: ['user'] })).map(m => m.user),
    names
  })
}
