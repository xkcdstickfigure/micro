import { useUser } from "../utils/userContext";
import Page from "../components/Page";
import PostField from "../components/PostField";
import Post from "../components/Post";
import { withRouter } from "next/router";
import { Box, Breadcrumb, Avatar, Button } from "@alleshq/reactants";
import axios from "axios";
import NotFound from "./404";
import { useState } from "react";
import cookies from "next-cookies";
import { User } from "react-feather";

const UserPage = withRouter(({ user: u }) => {
  if (!u) return <NotFound />;

  const user = useUser();
  const [following, setFollowing] = useState(u.followers.me);
  const followerCount = u.followers.count + following - u.followers.me;

  return (
    <Page
      title={u.name}
      breadcrumbs={
        <Breadcrumb.Item>
          <Avatar src={`https://avatar.alles.cc/${u.id}?size=25`} size={25} />
        </Breadcrumb.Item>
      }
    >
      <Box>
        <Box.Content className="space-y-3">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar
                src={`https://avatar.alles.cc/${u.id}?size=150`}
                size={150}
              />
            </div>
          </div>

          <div>
            <h1 className="text-center text-3xl font-medium">
              {u.name}
              <span className="text-primary text-sm">#{u.tag}</span>
            </h1>

            {u.nickname !== u.name && (
              <h2 className="text-center text-xl">{u.nickname}</h2>
            )}
          </div>

          <div className="flex justify-center space-x-3">
            {user.id !== u.id && (
              <Button
                size="sm"
                color={following ? "primary" : "secondary"}
                style={{ width: 100 }}
                onClick={() => {
                  setFollowing(!following);
                  axios
                    .post(
                      `/api/users/${u.id}/${following ? "unfollow" : "follow"}`,
                      {},
                      {
                        headers: {
                          Authorization: user.sessionToken,
                        },
                      }
                    )
                    .catch(() => {});
                }}
              >
                Follow{following && "ing"}
              </Button>
            )}

            <a
              href={`https://people.alles.cx/${encodeURIComponent(
                u.username ? u.username : u.id
              )}`}
            >
              <Box className="rounded-full px-2 py-1 text-gray-600 dark:text-gray-300 h-full flex flex-col justify-center">
                <User height={20} />
              </Box>
            </a>
          </div>

          <h3 className="text-center space-x-3">
            <span>
              <strong>{followerCount}</strong> Follower
              {followerCount === 1 ? "" : "s"}
            </span>
            <span>
              <strong>{u.posts.count}</strong> Post
              {u.posts.count === 1 ? "" : "s"}
            </span>
          </h3>

          {u.following.me && (
            <p className="text-center italic text-sm">
              {u.nickname} is following you
            </p>
          )}
        </Box.Content>
      </Box>

      <Box>
        <Box.Content>
          <div className="flex">
            <p className="flex-grow">Level {u.xp.level}</p>
            <p className="text-right ml-5">{u.xp.total} xp</p>
          </div>
          <div className="w-full h-5 mt-3 rounded-full overflow-hidden border border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
            <div
              className="h-full bg-primary"
              style={{
                width: `${u.xp.levelProgress * 100}%`,
              }}
            />
          </div>
        </Box.Content>
      </Box>

      {user.id === u.id && (
        <PostField placeholder="Say something about yourself!" />
      )}

      {u.posts.recent.map((p) => (
        <Post id={p} key={p} />
      ))}
    </Page>
  );
});

UserPage.getInitialProps = async (ctx) => {
  let id = ctx.query.user;

  try {
    if (id.length < 36)
      id = (
        await axios.get(
          `${process.env.NEXT_PUBLIC_ORIGIN}/api/username/${encodeURIComponent(
            id
          )}`
        )
      ).data.id;
  } catch (err) {}

  try {
    return {
      user: (
        await axios.get(
          `${process.env.NEXT_PUBLIC_ORIGIN}/api/users/${encodeURIComponent(
            id
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

export default UserPage;
