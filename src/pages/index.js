import { Box } from "@alleshq/reactants";
import { User, AtSign, Users, Sun, Moon } from "react-feather";
import { useUser } from "../utils/userContext";
import Page from "../components/Page";
import PostField from "../components/PostField";
import Post from "../components/Post";
import { useState, useEffect } from "react";
import axios from "axios";
import TrackVisibility from "react-on-screen";
import Link from "next/link";
import { useTheme } from "../utils/theme";

export default function Home() {
  const user = useUser();
  const [posts, setPosts] = useState();
  const { theme, toggleTheme } = useTheme();
  const [ThemeIcon, setThemeIcon] = useState(Moon);

  // Theme Icon
  useEffect(() => {
    setThemeIcon(theme === "light" ? Moon : Sun);
  }, [theme]);

  // Load new posts
  useEffect(() => {
    const updateFeed = () =>
      axios
        .get("/api/feed", {
          headers: {
            Authorization: user.sessionToken,
          },
        })
        .then(({ data }) => {
          const newPosts = posts
            ? data.posts.filter((p) => posts.indexOf(p) === -1)
            : data.posts;
          if (newPosts.length > 0)
            setPosts(posts ? newPosts.concat(posts) : newPosts);
          else if (!posts) setPosts([]);
        })
        .catch(() => {});

    updateFeed();
    const interval = setInterval(updateFeed, 30000);
    return () => clearInterval(interval);
  }, [posts]);

  // Load old posts
  const loadOlderPosts = () => {
    // Get last post
    axios.get(`/api/posts/${posts[posts.length - 1]}`).then((res) =>
      // Get posts before last post
      axios
        .get(`/api/feed?before=${new Date(res.data.createdAt).getTime()}`, {
          headers: {
            Authorization: user.sessionToken,
          },
        })
        .then((res) =>
          setPosts(
            posts.concat(res.data.posts.filter((p) => posts.indexOf(p) === -1))
          )
        )
    );
  };

  return (
    <Page>
      <div className="space-y-7">
        <div className="flex justify-between">
          <h4 className="font-medium text-3xl">
            Hey, {user.nickname}
            {user.plus && <sup className="select-none text-primary">+</sup>}
          </h4>

          <div className="flex space-x-4">
            <Link href="/[user]" as={`/${user.id}`}>
              <a className="transition duration-100 hover:opacity-75">
                <Box className="rounded-full p-2 text-gray-600 dark:text-gray-300">
                  <User />
                </Box>
              </a>
            </Link>

            <Link href="/followers">
              <a className="transition duration-100 hover:opacity-75">
                <Box className="rounded-full p-2 text-gray-600 dark:text-gray-300">
                  <Users />
                </Box>
              </a>
            </Link>

            <Link href="/mentions">
              <a className="transition duration-100 hover:opacity-75">
                <Box className="rounded-full p-2 text-gray-600 dark:text-gray-300">
                  <AtSign />
                </Box>
              </a>
            </Link>

            <a
              className="transition duration-100 hover:opacity-75 cursor-pointer"
              onClick={() => toggleTheme()}
            >
              <Box className="rounded-full p-2 text-gray-600 dark:text-gray-300">
                <ThemeIcon />
              </Box>
            </a>
          </div>
        </div>

        <PostField placeholder="What's up?" />
      </div>

      {posts &&
        (posts.length > 0 ? (
          posts.map((id) => (
            <TrackVisibility key={id}>
              {({ isVisible }) => {
                if (
                  isVisible &&
                  posts.indexOf(id) >= posts.length - 5 &&
                  posts.indexOf(id) >= 10
                )
                  loadOlderPosts();
                return <Post id={id} />;
              }}
            </TrackVisibility>
          ))
        ) : (
          <Box>
            <Box.Content>
              <p>
                It's a bit empty here. Find people to follow on the{" "}
                <Link href="/explore">
                  <a className="text-primary">Explore page</a>
                </Link>
                .
              </p>
            </Box.Content>
          </Box>
        ))}
    </Page>
  );
}
