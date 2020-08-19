import Page from "../components/Page";
import User from "../components/UserRow";
import axios from "axios";
import { Breadcrumb, Box } from "@reactants/ui";
import Link from "next/link";
import { Users } from "react-feather";
import cookies from "next-cookies";

const Followers = ({ count, users }) => (
  <Page
    title="Followers"
    breadcrumbs={<Breadcrumb.Item>Followers</Breadcrumb.Item>}
  >
    <Box>
      <Box.Content className="flex">
        <h1 className="text-xl font-medium flex-grow my-auto mr-5">
          {count} Follower{count === 1 ? "" : "s"}
        </h1>
        <Link href="/following">
          <a className="transition duration-100 hover:opacity-75">
            <Box className="rounded-full p-2 text-gray-600 dark:text-gray-300">
              <Users />
            </Box>
          </a>
        </Link>
      </Box.Content>
    </Box>

    {users.map((u) => (
      <User {...u} key={u.id} />
    ))}
  </Page>
);

Followers.getInitialProps = async (ctx) => {
  try {
    return (
      await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/api/followers`, {
        headers: {
          Authorization: cookies(ctx).sessionToken,
        },
      })
    ).data;
  } catch (err) {
    return {};
  }
};

export default Followers;
