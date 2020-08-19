import { Box, Avatar } from "@reactants/ui";
import Link from "next/link";

export default function UserRow({ id, name, tag, alles, avatar }) {
  return (
    <Link href="/[user]" as={`/${id}`}>
      <a className="block">
        <Box>
          <Box.Content className="flex">
            <Avatar
              {...(alles
                ? { id }
                : avatar
                ? { src: `https://fs.alles.cx/${avatar}` }
                : { id: "_" })}
              size={25}
            />
            <p className="ml-3 text-lg">
              {name}
              {alles && <span className="text-primary text-xs">#{tag}</span>}
            </p>
          </Box.Content>
        </Box>
      </a>
    </Link>
  );
}
