import db from "../../../../db";
import { Op } from "sequelize";
import auth from "../../../../utils/auth";
import getUser from "../../../../utils/getUser";

export default async (req, res) => {
  const user = await auth(req);
  if (typeof req.query.id !== "string")
    return res.status(400).json({ err: "badRequest" });

  // Get post
  const post = await db.Post.findOne({
    where: {
      id: req.query.id,
    },
  });
  if (!post) return res.status(404).json({ err: "missingResource" });

  // Get upvotes
  const upvotes = await db.Interaction.count({
    where: {
      postId: post.id,
      vote: "up",
    },
  });

  // Get downvotes
  const downvotes = await db.Interaction.count({
    where: {
      postId: post.id,
      vote: "down",
    },
  });

  // Get interaction
  const interaction = user
    ? await db.Interaction.findOne({
        where: {
          user: user.id,
          postId: post.id,
        },
      })
    : null;

  // Users
  const usersArray = (
    await Promise.all(
      (await post.getMentions({ attributes: ["user"] }))
        .map((m) => m.user)
        .concat(post.author)
        .map((id) => getUser(id))
    )
  ).filter((u) => !!u);

  const users = {};
  usersArray.forEach((u) => {
    users[u.user.id] = {
      name: u.user.name,
      nickname: u.alles ? u.user.nickname : u.user.name,
      plus: u.alles ? u.user.plus : false,
      alles: u.alles,
      avatar: u.alles ? null : u.user.avatar,
    };
  });

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
              author: post.author,
            },
            attributes: ["id"],
            order: [["createdAt", "DESC"]],
            limit: 100,
          })
        ).map((p) => p.id),
        ...(
          await post.getChildren({
            where: {
              author: {
                [Op.not]: post.author,
              },
            },
            attributes: ["id"],
            order: [["createdAt", "DESC"]],
            limit: 100,
          })
        ).map((p) => p.id),
      ],
      count: await post.countChildren(),
    },
    content: post.content,
    image: post.image,
    url: post.url,
    vote: {
      score: upvotes - downvotes,
      me: user
        ? interaction
          ? ["down", "neutral", "up"].indexOf(interaction.vote) - 1
          : 0
        : null,
    },
    interactions:
      user && user.id === post.author
        ? await db.Interaction.count({
            where: {
              postId: post.id,
            },
          })
        : null,
    createdAt: post.createdAt,
    users,
  });
};
