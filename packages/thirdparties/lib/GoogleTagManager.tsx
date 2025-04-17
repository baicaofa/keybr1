import { googleTagManagerId } from "./config.ts";

export const GoogleTagManager = ({
  id = googleTagManagerId,
}: {
  id?: string;
}) => {
  if (process.env.NODE_ENV === "development") {
    return null;
  }
  const html =
    `window.dataLayer=window.dataLayer||[];` +
    `function gtag(){dataLayer.push(arguments)};` +
    `gtag("js",new Date());` +
    `gtag("config","G-BJ9JKJYYRY");`;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: html }} />
      <script
        src="https://www.googletagmanager.com/gtag/js?id=G-BJ9JKJYYRY"
        defer={true}
      />
    </>
  );
};
