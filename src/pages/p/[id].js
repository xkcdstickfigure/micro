import { useUser } from "../../utils/userContext";
import Page from "../../components/Page";
import PostField from "../../components/PostField";
import Post from "../../components/Post";
import { useState } from "react";
import { useRouter } from "next/router";
import { Breadcrumb, Avatar } from "@alleshq/reactants";
import NotFound from "../404";
import Link from "next/link";

export default function PostPage() {
  const user = useUser();
  const { id } = useRouter().query;
  const [post, setPost] = useState();
  const [notFound, setNotFound] = useState(false);

  return !notFound ? (
    <Page
      title={post && `${post.author.name}: ${post.content.split("\n")[0]}`}
      breadcrumbs={
        post && (
          <Link href="/[user]" as={`/${post.author.id}`} passHref>
            <Breadcrumb.Item>
              <Avatar
                src={`https://avatar.alles.cc/${post.author.id}?size=25`}
                size={25}
              />
            </Breadcrumb.Item>
          </Link>
        )
      }
    >
      {post && post.parent && <Parent id={post.parent} />}

      <Post
        id={id}
        expanded
        onLoad={(data) => setPost(data)}
        onError={() => setNotFound(true)}
      />
      {post ? (
        <PostField
          placeholder={
            post.author.id === user.id
              ? "Continue the conversation..."
              : `Reply to ${post.author.nickname}...`
          }
          parent={post.id}
          key={`reply-${post.id}`}
        />
      ) : (
        <></>
      )}

      {post ? post.children.list.map((id) => <Post key={id} id={id} />) : <></>}
    </Page>
  ) : (
    <NotFound />
  );
}

function Parent({ id }) {
  const [post, setPost] = useState();

  return (
    <>
      {post && post.parent ? <Parent id={post.parent} /> : <></>}
      <Post id={id} onLoad={(data) => setPost(data)} />
      <div>
        <div className="mx-auto -my-7 w-1 h-7 bg-primary" />
      </div>
    </>
  );
}
