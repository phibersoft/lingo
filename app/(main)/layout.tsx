import { FC, ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <MobileHeader />
      <Sidebar className={"hidden lg:flex"} />
      <main className={"lg:pl-[256px] h-full pt-[50px] lg:pt-0"}>
        <div className={"max-w-[1056px] mx-auto h-full pt-6"}>{children}</div>
      </main>
    </>
  );
};

export default MainLayout;
