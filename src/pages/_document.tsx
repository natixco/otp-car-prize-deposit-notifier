import { Head, Html, Main, NextScript } from 'next/document';
import type { NextPage } from 'next';

const Document: NextPage = () => {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
              rel="stylesheet" />
      </Head>
      <body>
      <Main />
      <NextScript />
      </body>
    </Html>
  );
};

export default Document;