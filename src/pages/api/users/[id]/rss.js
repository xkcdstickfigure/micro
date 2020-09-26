import db from "../../../../db";
import getUser from "../../../../utils/getUser";
import esc from "escape-html";

export default async (req, res) => {
  if (typeof req.query.id !== "string")
    return res.status(400).json({ err: "badRequest" });

  // Get user
  const u = await getUser(req.query.id);
  if (!u) return res.status(404).json({ err: "missingResource" });

  // Get posts
  const posts = await db.Post.findAll({
    where: {
      author: u.id,
      parentId: null,
    },
    include: ["mentions"],
    order: [["createdAt", "DESC"]],
    limit: 100,
  });

  // Response
  res.send(
    `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
    <channel>
        <title>${esc(u.name)} on Alles Micro</title>
        <link>https://micro.alles.cx/${u.id}</link>
        <description>Posts by ${esc(u.nickname)} on Alles Micro</description>
        <image>
            <title>${esc(u.name)}</title>
            <link>https://micro.alles.cx/${u.id}</link>
            <url>https://avatar.alles.cc/${u.id}?size=100</url>
            <width>100</width>
            <height>100</height>
        </image>
        ${(
          await Promise.all(
            posts.map(
              async (p) => `<item>
                <title>${esc(p.content.split("\n")[0])}</title>
                <link>https://micro.alles.cx/p/${p.id}</link>
                <description>${esc(p.content)}</description>
                <pubDate>${p.createdAt.toUTCString()}</pubDate>
                <guid>alles-micro:${p.id}</guid>
            </item>`
            )
          )
        ).join("")}
    </channel>
</rss>`
  );
};
