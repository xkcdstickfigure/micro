import auth from '../../utils/auth'
import { v4 as uuid } from 'uuid'
import db from "../../db";

export default async (req, res) => {
  const user = await auth(req.cookies.sessionToken)
  if (!user) return res.status(401).send({ err: 'badAuthorization' })
  if (typeof req.body.content !== 'string') return res.status(400).json({ err: 'badRequest' })

  // Create post
  const post = await db.Post.create({
    id: uuid(),
    author: user.id,
    bot: false,
    content: req.body.content,
    score: 0
  });

  // Response
  res.json({ id: post.id })
}
