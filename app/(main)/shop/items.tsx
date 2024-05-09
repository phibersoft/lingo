"use client";

import { FC, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { refillHearts } from "@/actions/user-progress";
import { toast } from "sonner";
import { createStripeUrl } from "@/actions/user-subscription";

type ItemsProps = {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

const POINTS_TO_REFILL_HEART = 10;

export const Items: FC<ItemsProps> = ({
  hearts,
  points,
  hasActiveSubscription,
}) => {
  const [pending, startTransition] = useTransition();

  const onRefillHearts = () => {
    if (pending || hearts === 5 || points < POINTS_TO_REFILL_HEART) return;

    startTransition(() => {
      refillHearts().catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
    });
  };

  const onUpgrade = () => {
    startTransition(() => {
      createStripeUrl()
        .then((response) => {
          if (response.data) {
            window.location.href = response.data;
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });
    });
  };

  return (
    <ul className={"w-full"}>
      <div className={"flex items-center w-full p-4 gap-x-4 border-t-2"}>
        <Image src={"/heart.svg"} alt={"Heart"} height={50} width={50} />
        <div className={"flex-1"}>
          <p className={"text-neutral-700 text-base lg:text-xl font-bold"}>
            Refill hearts
          </p>
        </div>
        <Button
          disabled={pending || hearts === 5 || points < POINTS_TO_REFILL_HEART}
          onClick={onRefillHearts}
        >
          {hearts === 5 ? (
            "full"
          ) : (
            <div className={"flex items-center"}>
              <Image
                src={"/points.svg"}
                alt={"Points"}
                height={20}
                width={20}
              />
              <p>{POINTS_TO_REFILL_HEART}</p>
            </div>
          )}
        </Button>
      </div>
      <div className={"flex items-center w-full p-4 pt-8 gap-x-4 border-t-2"}>
        <Image
          src={"/unlimited.svg"}
          alt={"Unlimited"}
          height={60}
          width={60}
        />
        <div className={"flex-1"}>
          <p className={"text-neutral-700 text-base lg:text-xl font-bold"}>
            Unlimited hearts
          </p>
        </div>
        <Button disabled={pending} onClick={onUpgrade}>
          {hasActiveSubscription ? "settings" : "upgrade"}
        </Button>
      </div>
    </ul>
  );
};
