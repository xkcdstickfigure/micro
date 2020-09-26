import Page from "../components/Page";
import User from "../components/UserRow";
import axios from "axios";
import { Breadcrumb, Box } from "@alleshq/reactants";
import cookies from "next-cookies";

const Followers = ({ users }) => (
  <Page
    title="Explore"
    breadcrumbs={<Breadcrumb.Item>Explore</Breadcrumb.Item>}
  >
    <Box>
      <Box.Content>
        <h1 className="text-xl font-medium flex-grow my-auto mr-5">
          Find People to Follow
        </h1>
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
      await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/api/explore`, {
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
