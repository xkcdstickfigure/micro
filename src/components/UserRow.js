import { Box, Avatar } from "@alleshq/reactants";
import Link from "next/link";

export default function UserRow({ id, name, tag }) {
  return (
    <Link href="/[user]" as={`/${id}`}>
      <a className="block">
        <Box>
          <Box.Content className="flex">
            <Avatar src={`https://avatar.alles.cc/${id}?size=25`} size={25} />
            <p className="ml-3 text-lg">
              {name}
              <span className="text-primary text-xs">#{tag}</span>
            </p>
          </Box.Content>
        </Box>
      </a>
    </Link>
  );
}
