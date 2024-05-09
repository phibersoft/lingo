import { challengeOptions, challenges } from "@/db/schema";
import { FC } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/app/lesson/card";

type ChallengeProps = {
  options: Array<typeof challengeOptions.$inferSelect>;
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  type: typeof challenges.$inferSelect.type;
  selectedOption?: number;
  disabled?: boolean;
};

export const Challenge: FC<ChallengeProps> = ({
  options,
  onSelect,
  status,
  type,
  selectedOption,
  disabled,
}) => {
  return (
    <div
      className={cn(
        "grid gap-2",
        type === "ASSIST" && "grid-cols-1",
        type === "SELECT" &&
          "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]",
      )}
    >
      {options.map((option, index) => (
        <Card
          key={option.id}
          {...option}
          shortcut={`${index + 1}`}
          selected={selectedOption === option.id}
          onClick={() => onSelect(option.id)}
          status={status}
          disabled={disabled}
          type={type}
        />
      ))}
    </div>
  );
};
