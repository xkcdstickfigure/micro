import db from '../../../../db'
import getUser from '../../../../utils/getUser'
import esc from 'escape-html'
import plainContent from '../../../../utils/plainContent'

export default async (req, res) => {
  if (typeof req.query.id !== 'string') return res.status(400).json({ err: 'badRequest' })

  // Get user
  const u = await getUser(req.query.id)
  if (!u) return res.status(404).json({ err: 'missingResource' })

  // Get posts
  const posts = await db.Post.findAll({
    where: {
      author: u.user.id,
      parentId: null
    },
    include: ['mentions'],
    order: [['createdAt', 'DESC']],
    limit: 100
  })

  // Response
  res.send(
`<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
    <channel>
        <title>${esc(u.user.name)} on Alles Micro</title>
        <link>https://micro.alles.cx/u/${u.user.id}</link>
        <description>Posts by ${
            esc(u.alles ? u.user.nickname : u.user.name)
        } on Alles Micro</description>
        <image>
            <title>${esc(u.user.name)}</title>
            <link>https://micro.alles.cx/u/${u.user.id}</link>
            <url>${
                u.alles
                    ? `https://avatar.alles.cc/${u.user.id}?size=100`
                    : u.user.avatar
                        ? u.user.avatar
                        : 'https://avatar.alles.cc/_?size=100'
            }</url>
            <width>100</width>
            <height>100</height>
        </image>
        ${(await Promise.all(posts.map(async p => {
            const names = {};

            (await Promise.all(
                p.mentions
                    .map(m => m.user)
                    .concat(p.author)
                    .map(id => getUser(id))
            ))
                .filter(u => !!u)
                .forEach(u => { names[u.user.id] = u.user.name })

            const content = plainContent(p.content, names)

            return `<item>
                <title>${esc(content.split('\n')[0])}</title>
                <link>https://micro.alles.cx/p/${p.id}</link>
                <description>${esc(content)}</description>
            </item>`
        }))).join('')}
    </channel>
</rss>`
  )
}
