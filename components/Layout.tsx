import Head from "next/head";
import { FC, ReactNode } from "react";

type LayoutProps = {
  title: string;
  children: ReactNode;
};

export const Layout: FC<LayoutProps> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <header></header>
      <main>{children}</main>
      <footer></footer>
    </>
  );
};
