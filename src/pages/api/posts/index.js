import auth from "../../../utils/auth";
import { v4 as uuid } from "uuid";
import db from "../../../db";
import config from "../../../config";
import axios from "axios";
import getUser from "../../../utils/getUser";
import sharp from "sharp";
import FormData from "form-data";
import isUrl from "is-valid-http-url";
const { DISCORD_WEBHOOK } = process.env;

const api = async (req, res) => {
  const user = await auth(req);
  if (!user) return res.status(401).send({ err: "badAuthorization" });

  if (!req.body) return res.status(400).json({ err: "badRequest" });
  const { content, image, url, parent: parentId } = req.body;

  // Validate Content
  if (typeof content !== "string")
    return res.status(400).json({ err: "badRequest" });
  if (content.length < 1 || content.length > config.maxPostLength)
    return res.status(400).json({ err: "micro.post.length" });

  // Validate URL
  if (
    typeof url === "string" &&
    (!url.startsWith("https://") || url.length > 255 || !isUrl(url))
  )
    return res.status(400).json({ err: "micro.post.invalidUrl" });

  // Verify Parent
  let parent;
  if (typeof parentId === "string") {
    parent = await db.Post.findOne({
      where: {
        id: parentId,
      },
    });
    if (!parent) return res.status(400).json({ err: "micro.post.parent" });
  }

  // Upload image
  let imageId;
  if (typeof image === "string") {
    try {
      // Convert to Buffer
      let img = Buffer.from(image.split(";base64,")[1], "base64");

      // Resize
      img = await sharp(img)
        .resize({
          width: user.plus.active ? 1000 : 500,
          fit: "cover",
        })
        .png()
        .toBuffer();

      // Upload to WalnutFS
      const formData = new FormData();
      formData.append("file", img, {
        filename: "image",
      });
      imageId = (
        await axios.post(process.env.WALNUTFS_URI, formData.getBuffer(), {
          auth: {
            username: process.env.WALNUTFS_ID,
            password: process.env.WALNUTFS_SECRET,
          },
          headers: formData.getHeaders(),
        })
      ).data;
    } catch (err) {}
  }

  // Create post
  const post = await db.Post.create({
    id: uuid(),
    author: user.id,
    content,
    image: imageId,
    url: typeof url === "string" ? url : null,
    parentId: parent ? parent.id : null,
  });

  // Upvote post
  await db.Interaction.create({
    id: uuid(),
    user: user.id,
    postId: post.id,
    vote: "up",
  });

  // Create mentions
  if (parent) {
    const mentions = Array.from(
      (await parent.getMentions()).map((m) => m.user).concat(parent.author)
    );
    if (mentions.indexOf(user.id) > -1)
      mentions.splice(mentions.indexOf(user.id), 1);
    await Promise.all(
      mentions.map(async (id) => {
        const u = await getUser(id);

        // Create mention record
        if (u) {
          await db.Mention.create({
            id: uuid(),
            user: u.id,
            postId: post.id,
          });
        }
      })
    );
  }

  // Discord Webhook
  if (DISCORD_WEBHOOK && !parent)
    axios
      .post(DISCORD_WEBHOOK, {
        content: `https://micro.alles.cx/p/${post.id}`,
        embeds: [
          {
            description: post.content,
            color: 2315163,
            image: post.image
              ? {
                  url: `https://walnut1.alles.cc/${post.image}`,
                }
              : {},
          },
        ],
        username: `${user.name}#${user.tag}`,
        avatar_url: `https://avatar.alles.cc/${user.id}`,
      })
      .catch(() => {});

  // Response
  res.json({ id: post.id });
};

// API Config
const conf = {
  api: {
    bodyParser: {
      sizeLimit: config.imageSize,
    },
  },
};

// Exports
export { api as default, conf as config };
