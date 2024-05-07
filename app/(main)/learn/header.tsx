import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type HeaderProps = {
  title: string;
};

export const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <div
      className={
        "sticky top-0 bg-white pb-3 lg:pt-[28px] lg:mt-[-28px] flex items-center justify-between border-b-2 mb-5 text-neutral-400 lg:z-50"
      }
    >
      <Link href={"/courses"}>
        <Button variant={"ghost"} size={"sm"}>
          <ArrowLeft className={"h-5 w-5 stroke-2 text-neutral-400"} />
        </Button>
      </Link>
      <h1 className={"font-bold text-lg"}>{title}</h1>
      {/* This div balances the flex */}
      <div />
    </div>
  );
};