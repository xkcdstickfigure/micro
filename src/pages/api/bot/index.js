import auth from "../../../utils/botAuth";

export default async (req, res) => {
  const bot = await auth(req);
  if (!bot) return res.status(401).json({ err: "badAuthorization" });

  res.json({
    id: bot.id,
    name: bot.name,
    avatar: bot.avatar,
    createdAt: bot.createdAt,
  });
};
