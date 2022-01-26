import { useSession } from "next-auth/react";
import React from "react";
import ChannelBar from "../../components/ChannelBar";
import ContentContainer from "../../components/ContentContainer";
import SideBar from "../../components/SideBar";
import CreateServerModal from "../../modals/CreateServerModal";
import CreateChannelModal from "../../modals/CreateChannelModal";
import { useRouter } from "next/router";
import HomePage from "../HomePage";
import Head from "next/head";

export default function Channel() {
  const { data: session } = useSession();
  const query = useRouter();
  if (!session) {
    return <HomePage />;
  }

  return (
    <div>
      <Head>
        <title>Discord</title>
        <link rel="icon" href="/discord-icon.svg" />
      </Head>
      <div className="flex">
        <SideBar />
        {!query.query.id ? (
          <>
            <ChannelBar content={false} />
            <ContentContainer content={false} />
          </>
        ) : (
          <>
            <ChannelBar content={true} />
            <ContentContainer content={true} />
          </>
        )}
      </div>
      <CreateServerModal />
      <CreateChannelModal />
    </div>
  );
}
