import parseContent from "../utils/parseContent";
import Link from "next/link";

export default function ContentTags({ children }) {
  const segments = parseContent(children);
  return segments.map((segment, i) => {
    return {
      text: segment.string,
      user: (
        <Link href="/u/[id]" as={`/u/${segment.string}`} key={i}>
          <a className="text-primary" onClick={(e) => e.stopPropagation()}>
            @{[segment.string]}
          </a>
        </Link>
      ),
    }[segment.type];
  });
}
