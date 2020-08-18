import Page from "../components/Page";
import Post from "../components/Post";
import axios from "axios";
import { useEffect } from "react";
import { Breadcrumb } from "@reactants/ui";

const Mentions = ({ posts }) => {
  // Mark as read
  useEffect(() => {
    axios.post("/api/mentions/read");
  }, []);

  return (
    <Page
      title="Mentions and Replies"
      breadcrumbs={<Breadcrumb.Item>Mentions and Replies</Breadcrumb.Item>}
    >
      {posts.length > 0 ? (
        posts.map((p) => <Post id={p.id} bubble={!p.read} key={p.id} />)
      ) : (
        <p>You don't have any notifications just yet!</p>
      )}
    </Page>
  );
};

Mentions.getInitialProps = async (ctx) =>
  (
    await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/api/mentions`, {
      headers:
        ctx.req && ctx.req.headers.cookie
          ? {
              cookie: ctx.req.headers.cookie,
            }
          : {},
    })
  ).data;

export default Mentions;
