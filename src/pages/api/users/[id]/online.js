export default (_req, res) => {
  res.json({ online: Math.floor(Math.random() * 2) === 0 })
}
