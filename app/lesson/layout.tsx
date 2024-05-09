import { FC, ReactNode } from "react";

type LessonLayoutProps = {
  children: ReactNode;
};

const LessonLayout: FC<LessonLayoutProps> = ({ children }) => {
  return (
    <div className={"flex flex-col h-full"}>
      <div className={"flex flex-col h-full w-full"}>{children}</div>
    </div>
  );
};

export default LessonLayout;
