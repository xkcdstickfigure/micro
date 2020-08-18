import parseContent from "./parseContent";

export default function plainContent(content, names) {
  return parseContent(content)
    .map(
      (segment) =>
        ({
          text: segment.string,
          tag: `#${segment.string}`,
          user: names[segment.string]
            ? names[segment.string]
            : `@${segment.string}`,
        }[segment.type])
    )
    .join("");
}
