import { Circle, Bell } from "react-feather";
import { Header, Breadcrumb, Avatar } from "@reactants/ui";
import { useUser } from "../utils/userContext";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Page({ title, breadcrumbs, children }) {
  const user = useUser();
  const router = useRouter();
  const [notificationsCount, setNotificationsCount] = useState(0);

  // Get notifications count
  useEffect(() => {
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
        <title>{title ? `Micro • ${title}` : "Alles Micro"}</title>
      </Head>

      <Header>
        <div className="p-5 max-w-2xl w-full mx-auto flex justify-between">
          <Breadcrumb>
            <Link href="/">
              <Breadcrumb.Item className="font-medium text-lg inline-flex items-center">
                <Circle className="text-gray-500 inline w-5 mr-2" />
                Micro
              </Breadcrumb.Item>
            </Link>

            {breadcrumbs}
          </Breadcrumb>

          <div className="flex items-center space-x-3">
            {notificationsCount && router.pathname !== "/mentions" ? (
              <Link href="/mentions">
                <a className="select-none hover:bg-danger-85 transition duration-200 ease bg-danger text-white rounded-full flex items-center justify-center py-0.5 px-2.5 space-x-1">
                  <Bell size={0.35 * 37.5} />
                  <span>{notificationsCount}</span>
                </a>
              </Link>
            ) : (
              <></>
            )}

            <Avatar id={user.id} size={37.5} />
          </div>
        </div>
      </Header>

      <div className="sm:max-w-xl p-5 mx-auto my-5 space-y-7">{children}</div>
    </>
  );
}
