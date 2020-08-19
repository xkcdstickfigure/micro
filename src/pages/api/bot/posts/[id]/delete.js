import db from "../../../../../db";
import auth from "../../../../../utils/botAuth";

export default async (req, res) => {
  const bot = await auth(req);
  if (!bot) return res.status(401).json({ err: "badAuthorization" });

  // Get post
  const post = await db.Post.findOne({
    where: {
      id: req.query.id,
    },
  });
  if (!post) return res.status(404).json({ err: "missingResource" });
  if (post.author !== bot.id)
    return res.status(400).json({ err: "micro.post.notAuthor" });

  // Delete post
  await post.destroy();

  // Response
  res.json({});
};
