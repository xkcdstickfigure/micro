import parseContent from './parseContent'

export default function plainContent (content, users) {
  return parseContent(content.split('\n')[0])
    .map(segment => ({
      text: segment.string,
      tag: `#${segment.string}`,
      user: users[segment.string] ? users[segment.string].name : `@${segment.string}`
    }[segment.type]))
    .join('')
}
