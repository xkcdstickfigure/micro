import Page from "../components/Page";
import Post from "../components/Post";
import axios from "axios";
import { useEffect } from "react";
import { Breadcrumb } from "@alleshq/reactants";
import { useUser } from "../utils/userContext";
import cookies from "next-cookies";

const Mentions = ({ posts }) => {
  const user = useUser();

  // Mark as read
  useEffect(() => {
    axios.post(
      "/api/mentions/read",
      {},
      {
        headers: {
          Authorization: user.sessionToken,
        },
      }
    );
  }, []);

  return (
    <Page
      title="Replies"
      breadcrumbs={<Breadcrumb.Item>Replies</Breadcrumb.Item>}
    >
      {posts.length > 0 ? (
        posts.map((p) => <Post id={p.id} bubble={!p.read} key={p.id} />)
      ) : (
        <p>You don't have any replies just yet!</p>
      )}
    </Page>
  );
};

Mentions.getInitialProps = async (ctx) => {
  try {
    return (
      await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/api/mentions`, {
        headers: {
          Authorization: cookies(ctx).sessionToken,
        },
      })
    ).data;
  } catch (err) {
    return {};
  }
};

export default Mentions;
