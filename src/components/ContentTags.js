import parseContent from '../utils/parseContent'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function ContentTags ({ children, links }) {
  const segments = parseContent(children)
  return segments.map((segment, i) => {
    const [user, setUser] = useState()

    useEffect(() => {
      if (segment.type !== 'user') return
      axios.get(`/api/users/${encodeURIComponent(segment.string)}`)
        .then(({ data }) => setUser(data))
        .catch(() => {})
    }, [])

    // Return JSX
    return ({
      text: segment.string,
      tag: links ? (
        <Link href='/tag/[tag]' as={`/tag/${segment.string}`} key={i}>
          <a className='text-primary' onClick={e => e.stopPropagation()}>
                #{segment.string}
          </a>
        </Link>
      ) : (
        <span className='text-primary' key={i}>#{segment.string}</span>
      ),
      user: user ? (
        links ? (
          <Link href='/u/[id]' as={`/u/${segment.string}`} key={i}>
            <a className='text-primary' onClick={e => e.stopPropagation()}>
              {user.name}
            </a>
          </Link>
        ) : (
          <span className='text-primary' key={i}>{user.name}</span>
        )
      ) : `@${segment.string}`
    }[segment.type])
  })
};
