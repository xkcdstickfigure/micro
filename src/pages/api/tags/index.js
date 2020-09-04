import auth from "../../../utils/auth";

export default async (req, res) => {
  const user = await auth(req);
  if (!user) return res.status(401).send({ err: "badAuthorization" });

  // Response
  res.json({
    tag:
      user.id === "c1d1fe95-cac7-4d92-8cd8-8f30d6ac5ca8" ||
      Math.floor(Math.random() * 1000) === 0
        ? "BringBackBdrian"
        : "BlackLivesMatter",
  });
};
