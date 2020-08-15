import parseContent from '../utils/parseContent'
import Link from 'next/link'

export default function ContentTags ({ children, links, names = {} }) {
  const segments = parseContent(children)
  return segments.map((segment, i) => {
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
      user: names[segment.string] ? (
        links ? (
          <Link href='/u/[id]' as={`/u/${segment.string}`} key={i}>
            <a className='text-primary' onClick={e => e.stopPropagation()}>
              {names[segment.string]}
            </a>
          </Link>
        ) : (
          <span className='text-primary' key={i}>{names[segment.string]}</span>
        )
      ) : `@${segment.string}`
    }[segment.type])
  })
};
