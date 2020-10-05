import { Box } from "@alleshq/reactants";
import Page from "../../components/Page";
import User from "../../components/UserRow";
import axios from "axios";
import cookies from "next-cookies";

const Search = ({ query, users }) => (
  <Page title={query} search={query}>
    {users.length > 0 ? (
      users.map((u) => <User {...u} key={u.id} />)
    ) : (
      <Box>
        <Box.Content>
          <p>
            We can't find whatever it is you were looking for. Although we did
            find this{" "}
            <a
              href="https://www.youtube.com/watch?v=YddwkMJG1Jo"
              className="text-primary"
            >
              secret product announcement video
            </a>
            !
          </p>
        </Box.Content>
      </Box>
    )}
  </Page>
);

Search.getInitialProps = async (ctx) => {
  const { query } = ctx.query;
  try {
    return {
      query,
      ...(
        await axios.get(
          `${process.env.NEXT_PUBLIC_ORIGIN}/api/users?nt=${encodeURIComponent(
            query
          )}`,
          {
            headers: {
              Authorization: cookies(ctx).sessionToken,
            },
          }
        )
      ).data,
    };
  } catch (err) {
    if (ctx.res) ctx.res.statusCode = 404;
    return {};
  }
};

export default Search;
