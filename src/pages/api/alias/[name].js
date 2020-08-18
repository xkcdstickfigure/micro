import db from "../../../db";

export default async (req, res) => {
  if (typeof req.query.name !== "string")
    return res.status(400).json({ err: "badRequest" });

  // Get Alias
  const alias = await db.Alias.findOne({
    where: {
      name: req.query.name,
    },
  });

  // Response
  if (alias) res.json(alias);
  else res.status(404).json({ err: "notFound" });
};
