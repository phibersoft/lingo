import { FC, ReactNode } from "react";

type FeedWrapperProps = {
  children: ReactNode;
};

export const FeedWrapper: FC<FeedWrapperProps> = ({ children }) => {
  return <div className={"flex-1 relative top-0 pb-10"}>{children}</div>;
};
