import "@mantine/core/styles.css";
import Head from "next/head";
import {MantineProvider} from "@mantine/core";
import {theme} from "../theme";
import {Layout} from "../components/layout/Layout";
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import {Notifications} from "@mantine/notifications";
import {ModalsProvider} from "@mantine/modals";
import PusherHandler from "../components/common/PusherHandler";

export default function App({Component, pageProps}: any) {
    return (
        <MantineProvider theme={theme}>
            <ModalsProvider>
                <Notifications position="top-center"/>
                <Head>
                    <title>Devco v2</title>
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
                    />
                    <link rel="shortcut icon" href="/favicon.svg"/>
                </Head>
                <Layout>

                    <Component {...pageProps} />
                </Layout>
                <PusherHandler
                    channelName="bidupdates"
                    eventName="bid.changed"
                />
            </ModalsProvider>
        </MantineProvider>
    );
}
