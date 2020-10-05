import { Input } from "@alleshq/reactants";
import { Search as Icon } from "react-feather";
import { useState } from "react";
import axios from "axios";
import { useUser } from "../utils/userContext";
import Router from "next/router";

export default function UserSearch({ query }) {
  const [input, setInput] = useState("");
  const user = useUser();

  const submit = (e) => {
    e.preventDefault();
    axios
      .get(`/api/users?nt=${encodeURIComponent(input)}`, {
        headers: {
          Authorization: user.sessionToken,
        },
      })
      .then(({ data }) => {
        if (data.users.length === 1)
          Router.push("/[user]", `/${data.users[0].id}`);
        else
          Router.push(
            "/search/[query]",
            `/search/${encodeURIComponent(input)}`
          );
      })
      .catch(() => {});
  };

  return (
    <form onSubmit={submit}>
      <Input
        onInput={(e) => setInput(e.target.value)}
        iconRight={<Icon />}
        onIconRightClick={submit}
        placeholder="Find some cool people"
        defaultValue={query}
      />
    </form>
  );
}
