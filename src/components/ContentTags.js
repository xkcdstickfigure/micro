import parseContent from "../utils/parseContent";
import Link from "next/link";

export default function ContentTags({ children, links, users = {} }) {
  const segments = parseContent(children);
  return segments.map((segment, i) => {
    return {
      text: segment.string,
      tag: links ? (
        <Link href="/tag/[name]" as={`/tag/${segment.string}`} key={i}>
          <a className="text-primary" onClick={(e) => e.stopPropagation()}>
            #{segment.string}
          </a>
        </Link>
      ) : (
        <span className="text-primary" key={i}>
          #{segment.string}
        </span>
      ),
      user: users[segment.string] ? (
        links ? (
          <Link href="/[user]" as={`/${segment.string}`} key={i}>
            <a className="text-primary" onClick={(e) => e.stopPropagation()}>
              {users[segment.string].name}
            </a>
          </Link>
        ) : (
          <span className="text-primary" key={i}>
            {users[segment.string].name}
          </span>
        )
      ) : (
        `@${segment.string}`
      ),
    }[segment.type];
  });
}
