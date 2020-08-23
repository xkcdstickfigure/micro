import { Box, Avatar } from "@alleshq/reactants";
import Link from "next/link";

export default function UserRow({ id, name, tag, alles, avatar }) {
  return (
    <Link href="/[user]" as={`/${id}`}>
      <a className="block">
        <Box>
          <Box.Content className="flex">
            <Avatar
              src={
                alles
                  ? `https://avatar.alles.cc/${id}?size=25`
                  : avatar
                  ? `https://fs.alles.cx/${avatar}`
                  : `https://avatar.alles.cc/_?size=25`
              }
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
