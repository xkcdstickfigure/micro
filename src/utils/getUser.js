import axios from 'axios'
import db from '../db'
const { NEXUS_ID, NEXUS_SECRET, NEXUS_URI } = process.env

export default async id => {
  // Declare user
  let u

  // Check for Alles user
  try {
    u = {
      user: (
        await axios.get(`${NEXUS_URI}/users/${encodeURIComponent(id)}`, {
          auth: {
            username: NEXUS_ID,
            password: NEXUS_SECRET
          }
        })
      ).data,
      alles: true
    }
  } catch (err) {}

  // Check database for non-Alles user
  if (!u) {
    u = {
      user: await db.User.findOne({
        where: {
          id
        }
      }),
      alles: false
    }
  }

  // Return
  return u.user ? u : null
}
