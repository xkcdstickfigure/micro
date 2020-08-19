import db from "../db";

export default async (req) => {
  // Auth Header
  if (
    typeof req.headers.authorization !== "string" ||
    !req.headers.authorization.startsWith("Basic ") ||
    req.headers.authorization.split(" ").length !== 2
  )
    return;

  // Parse Credentials
  const encoded = req.headers.authorization.split(" ")[1];
  let credentials;
  try {
    credentials = Buffer.from(encoded, "base64").toString().split(":");
  } catch (err) {
    return;
  }
  if (credentials.length !== 2) return;

  // Get Client
  const bot = await db.User.findOne({
    where: {
      id: credentials[0],
    },
  });
  if (!bot || !bot.secret || bot.secret !== credentials[1]) return;

  // Return data
  return bot;
};
