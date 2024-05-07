"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type SidebarItemProps = {
  label: string;
  iconSrc: string;
  href: string;
};

export const SidebarItem: FC<SidebarItemProps> = ({ label, iconSrc, href }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button
      variant={isActive ? "sidebarOutline" : "sidebar"}
      className={"justify-start h-[52px]"}
      asChild
    >
      <Link href={href}>
        <Image
          src={iconSrc}
          alt={label}
          className={"mr-5"}
          height={32}
          width={32}
        />
        {label}
      </Link>
    </Button>
  );
};
