import { Html, Head, Main, NextScript } from "next/document";
import i18n from '@/i18n';

export default function Document() {
    return (
        <Html lang={i18n.language || 'en'}>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <body className="antialiased">
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}