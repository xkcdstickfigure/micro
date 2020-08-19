import auth from "../../../utils/auth";
import { v4 as uuid } from "uuid";
import db from "../../../db";
import config from "../../../config";
import axios from "axios";
import parseContent from "../../../utils/parseContent";
import getUser from "../../../utils/getUser";
import sharp from "sharp";
import FormData from "form-data";
import isUrl from "is-valid-http-url";

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

  // Parse content
  const parsedContent = parseContent(content);

  let mentions = parsedContent
    .filter(
      (segment) => segment.type === "user" && segment.string.length === 36
    )
    .map((segment) => segment.string);

  const tags = Array.from(
    new Set(
      parsedContent
        .filter(
          (segment) =>
            segment.type === "tag" &&
            segment.string.length >= config.minTagLength &&
            segment.string.length <= config.maxTagLength
        )
        .map((segment) => segment.string)
    )
  );

  // Verify Parent
  let parent;
  if (typeof parentId === "string") {
    parent = await db.Post.findOne({
      where: {
        id: parentId,
      },
    });
    if (!parent) return res.status(400).json({ err: "micro.post.parent" });

    mentions.push(parent.author);
    mentions = mentions.concat((await parent.getMentions()).map((m) => m.user));
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
          width: user.plus ? 1000 : 500,
          fit: "cover",
        })
        .png()
        .toBuffer();

      // Upload to AllesFS
      const formData = new FormData();
      formData.append("file", img, {
        filename: "image",
      });
      formData.append("public", "true");
      imageId = (
        await axios.post(process.env.ALLESFS_URI, formData.getBuffer(), {
          auth: {
            username: process.env.ALLESFS_ID,
            password: process.env.ALLESFS_SECRET,
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
    score,
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
  mentions = Array.from(new Set(mentions));
  if (mentions.indexOf(user.id) > -1)
    mentions.splice(mentions.indexOf(user.id), 1);
  await Promise.all(
    mentions.map(async (id) => {
      const u = await getUser(id);

      // Create mention record
      if (u) {
        await db.Mention.create({
          id: uuid(),
          user: u.user.id,
          postId: post.id,
        });
      }
    })
  );

  // Create tags
  await Promise.all(
    tags.map((name) =>
      db.Tag.create({
        id: uuid(),
        name,
        postId: post.id,
      })
    )
  );

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
