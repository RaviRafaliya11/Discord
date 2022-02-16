import { useSession } from "next-auth/react";
import ChannelBar from "../../components/ChannelBar";
import ContentContainer from "../../components/ContentContainer";
import SideBar from "../../components/SideBar";
import CreateServerModal from "../../modals/CreateServerModal";
import CreateChannelModal from "../../modals/CreateChannelModal";
import EditServerModal from "../../modals/EditServerModal";
import { useRouter } from "next/router";
import HomePage from "../HomePage";
import Head from "next/head";
import EditChannelModal from "../../modals/EditChannelModal";

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
        {!query.query.sid ? (
          <>
            <ChannelBar content={false} />
            <ContentContainer content={false} />
          </>
        ) : (
          <>
            <ChannelBar content={true} />
            <ContentContainer content={true} serverhome={query.query.cid} />
          </>
        )}
      </div>
      <CreateServerModal />
      <CreateChannelModal />
      <EditServerModal />
      <EditChannelModal />
    </div>
  );
}
