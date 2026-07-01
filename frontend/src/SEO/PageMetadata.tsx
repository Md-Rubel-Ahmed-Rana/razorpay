import Head from "next/head";

const defaultTitle = "Secure Online Payments";

const defaultDescription =
  "Experience fast, secure, and seamless online payments powered by Razorpay. Shop confidently using UPI, Credit Cards, Debit Cards, Net Banking, Wallets, and more.";

const defaultKeywords =
  "Razorpay, Online Payment, Secure Checkout, UPI Payment, Credit Card, Debit Card, Net Banking, Wallet, E-commerce, Payment Gateway, India";

type Props = {
  title?: string;
  description?: string;
  keywords?: string;
};

const PageMetadata = ({
  title = defaultTitle,
  description = defaultDescription,
  keywords = defaultKeywords,
}: Props) => {
  const fullTitle = `${title} | RazorPay Demo`;

  return (
    <Head>
      <title>{fullTitle}</title>

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      <meta name="author" content="Md Rubel Ahmed Rana" />
      <meta name="robots" content="index, follow" />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <meta name="theme-color" content="#2563EB" />
    </Head>
  );
};

export default PageMetadata;
