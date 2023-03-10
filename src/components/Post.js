import { Avatar, Box, Button } from "@alleshq/reactants";
import { Plus, Minus, MessageCircle, Eye, Trash, Info } from "react-feather";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { useUser } from "../utils/userContext";
import Router from "next/router";
import Tags from "./ContentTags";

export default function Post({ id, expanded, bubble, onLoad, onError }) {
  const [post, setPost] = useState();
  const [score, setScore] = useState();
  const [vote, setVote] = useState();
  const [voteChanged, setVoteChanged] = useState(false);
  const [rickroll, setRickroll] = useState(false);
  const user = useUser();

  // Interaction
  const interaction = () => {
    if (!user) return;
    axios
      .post(
        `/api/posts/${encodeURIComponent(id)}/interaction`,
        {},
        {
          headers: {
            Authorization: user.sessionToken,
          },
        }
      )
      .catch(() => {});
  };

  // Load data
  useEffect(() => {
    // Get post
    axios
      .get(`/api/posts/${encodeURIComponent(id)}`, {
        headers: user
          ? {
              Authorization: user.sessionToken,
            }
          : {},
      })
      .then(({ data }) => {
        setPost(data);
        setScore(data.vote.score);
        setVote(data.vote.me);

        // Rickroll
        if (data.url)
          axios
            .get(
              `https://astley.vercel.app?url=${encodeURIComponent(data.url)}`
            )
            .then((res) => setRickroll(res.data.rickroll))
            .catch(() => {});

        // On Load
        if (onLoad) onLoad(data);
      })
      .catch((err) => {
        if (onError) onError(err);
      });

    // Interaction
    if (expanded) interaction();
  }, [id]);

  // Vote change
  useEffect(() => {
    if (!post || vote === null) return;
    setScore(post.vote.score + vote - post.vote.me);
    if (voteChanged)
      axios.post(
        `/api/posts/${post.id}/vote`,
        { vote },
        {
          headers: {
            Authorization: user.sessionToken,
          },
        }
      );
  }, [vote]);

  const author = post && (
    <div className="flex items-center mb-3">
      <Avatar
        src={`https://avatar.alles.cc/${post.author.id}?size=35`}
        className="mr-3"
        size={32.5}
      />
      <div>
        <div className="text-black dark:text-white text-lg">
          {post.author.name}
          {post.author.plus && (
            <sup className="select-none text-primary">+</sup>
          )}
        </div>
      </div>
    </div>
  );

  const content = post && (
    <>
      <Box.Content className="space-y-5">
        <div>
          {expanded ? (
            <Link href="/[user]" as={`/${post.author.id}`}>
              <a>{author}</a>
            </Link>
          ) : (
            author
          )}

          <div
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            <Tags>{post.content}</Tags>
          </div>
        </div>

        {post.image && (
          <img
            className="w-full rounded-lg"
            src={`https://walnut1.alles.cc/${post.image}`}
          />
        )}

        {post.url && (
          <a
            className="rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 px-3 py-1 italic overflow-hidden box-border truncate block"
            href={post.url}
            target="_blank"
            onClick={(e) => {
              e.stopPropagation();
              interaction();
            }}
          >
            {post.url}
          </a>
        )}

        {rickroll && (
          <div className="text-primary flex">
            <Info className="mr-2" /> This link may contain a rickroll
          </div>
        )}
      </Box.Content>
      <Box.Footer
        className={`rounded-bl-none flex justify-between bg-transparent ${
          expanded ? "" : "cursor-pointer"
        }`}
      >
        <span>{moment(post.createdAt).fromNow()}</span>
        <span className="flex items-center space-x-2">
          {user && post.author.id === user.id && expanded && (
            <div className="cursor-pointer hover:text-danger mr-2">
              <Trash
                className="ml-1.5"
                size={17}
                onClick={() => {
                  axios
                    .delete(`/api/posts/${post.id}/delete`, {
                      headers: {
                        Authorization: user.sessionToken,
                      },
                    })
                    .then(() => {
                      if (post.parent)
                        Router.push("/p/[id]", `/p/${post.parent}`);
                      else Router.push("/");
                    })
                    .catch(() => {});
                }}
              />
            </div>
          )}

          {post.interactions !== null && (
            <div className="flex items-center">
              {post.interactions}
              <Eye className="ml-1.5" size={17} />
            </div>
          )}

          <div className="flex items-center">
            {post.children.count}
            <MessageCircle className="ml-1.5" size={17} />
          </div>
        </span>
      </Box.Footer>
    </>
  );

  return !post ? (
    <Box className="flex">
      <div className="space-y-3 flex bg-white rounded-tl-lg rounded-bl-lg dark:bg-gray-750 border-r p-2.5 border-gray-200 dark:border-gray-700 flex-col items-center justify-center">
        <Button color="transparent" style={{ padding: 0, opacity: 0.5 }}>
          <Plus size={17.5} />
        </Button>
        <span className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <Button color="transparent" style={{ padding: 0, opacity: 0.5 }}>
          <Minus size={17.5} />
        </Button>
      </div>

      <div className="block w-full">
        <Box.Content>
          <div className="flex items-center mb-3">
            <div
              className="mr-3 bg-gray-200 dark:bg-gray-700 rounded-full"
              style={{ width: 32.5, height: 32.5 }}
            />
            <div className="space-y-1">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-sm dark:bg-white h-3 w-10" />
              <div className="bg-gray-200 dark:bg-gray-700 rounded-sm h-3 w-15" />
            </div>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 h-15 rounded w-full" />
        </Box.Content>
        <Box.Footer
          className="rounded-bl-none flex justify-between"
          style={{ background: "transparent" }}
        >
          <span className="bg-gray-200 dark:bg-gray-700 w-20 h-3 rounded-sm" />
          <span className="bg-gray-200 dark:bg-gray-700 w-13 h-3 rounded-sm" />
        </Box.Footer>
      </div>
    </Box>
  ) : (
    <Box className="relative">
      <div className="flex">
        <div className="space-y-3 flex bg-white rounded-tl-lg rounded-bl-lg dark:bg-gray-750 border-r p-2.5 border-gray-200 dark:border-gray-700 flex-col items-center justify-center">
          <Button
            onClick={() => {
              if (!user) return;
              setVoteChanged(true);
              setVote(vote === 1 ? 0 : 1);
            }}
            style={{ padding: 0 }}
            color={vote === 1 ? undefined : "transparent"}
          >
            <Plus size={17.5} />
          </Button>
          <span>{score}</span>
          <Button
            onClick={() => {
              if (!user) return;
              setVoteChanged(true);
              setVote(vote === -1 ? 0 : -1);
            }}
            style={{ padding: 0 }}
            color={vote === -1 ? undefined : "transparent"}
          >
            <Minus size={17.5} />
          </Button>
        </div>

        {expanded ? (
          <div className="block w-full min-w-0">{content}</div>
        ) : (
          <Link href="/p/[id]" as={`/p/${post.id}`}>
            <a className="block w-full min-w-0 hover:opacity-75 transition duration-100 cursor-pointer">
              {content}
            </a>
          </Link>
        )}

        {bubble && (
          <div
            className="bg-primary opacity-75 rounded-full absolute"
            style={{
              width: 20,
              height: 20,
              top: -5,
              right: -5,
            }}
          />
        )}
      </div>
    </Box>
  );
}
