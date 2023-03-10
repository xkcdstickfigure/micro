import { Hash, Bell } from "react-feather";
import { Header, Breadcrumb, Avatar } from "@alleshq/reactants";
import { useUser } from "../utils/userContext";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useTheme } from "../utils/theme";
import UserSearch from "./Search";

export default function Page({ title, breadcrumbs, search, children }) {
  const user = useUser();
  const router = useRouter();
  const [notificationsCount, setNotificationsCount] = useState(0);
  useTheme();

  // Get notifications count
  useEffect(() => {
    if (!user || router.pathname === "/replies") return;
    const updateNotificationCount = () =>
      axios
        .get("/api/mentions?unread", {
          headers: {
            Authorization: user.sessionToken,
          },
        })
        .then(({ data }) => setNotificationsCount(data.posts.length))
        .catch(() => {});

    updateNotificationCount();
    const interval = setInterval(updateNotificationCount, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>
          {(notificationsCount > 0 ? `(${notificationsCount}) ` : ``) +
            (title ? `Micro • ${title}` : `Alles Micro`)}
        </title>
        <link rel="icon" href="/icon-circle.png" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Micro" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </Head>

      <Header>
        <div className="p-5 max-w-2xl w-full mx-auto flex justify-between">
          <Breadcrumb>
            <Link href="/" passHref>
              <Breadcrumb.Item className="font-medium text-lg inline-flex items-center">
                <Hash className="text-gray-500 inline w-5 mr-2" />
                Micro
              </Breadcrumb.Item>
            </Link>

            {breadcrumbs}
          </Breadcrumb>

          {user && (
            <>
              <div className="flex-grow px-5 hidden sm:block">
                <UserSearch query={search} />
              </div>

              <div className="flex items-center space-x-3">
                {notificationsCount > 0 && (
                  <Link href="/replies">
                    <a className="select-none hover:bg-danger-85 transition duration-200 ease bg-danger text-white rounded-full flex items-center justify-center py-0.5 px-2.5 space-x-1">
                      <Bell size={0.35 * 37.5} />
                      <span>{notificationsCount}</span>
                    </a>
                  </Link>
                )}

                <Avatar
                  src={`https://avatar.alles.cc/${user.id}?size=40`}
                  size={37.5}
                />
              </div>
            </>
          )}
        </div>
      </Header>

      <div className="sm:max-w-xl p-5 mx-auto my-5 space-y-7">{children}</div>
    </>
  );
}
