import { lessons, units } from "@/db/schema";
import { FC } from "react";
import { UnitBanner } from "@/app/(main)/learn/unit-banner";
import { LessonButton } from "@/app/(main)/learn/lesson-button";

type UnitProps = {
  lessons: Array<
    typeof lessons.$inferSelect & {
      completed: boolean;
    }
  >;
  activeLesson?: typeof lessons.$inferSelect & {
    unit: typeof units.$inferSelect;
  };
  activeLessonPercentage: number;
} & Pick<typeof units.$inferSelect, "id" | "order" | "title" | "description">;

export const Unit: FC<UnitProps> = ({
  id,
  order,
  description,
  title,
  lessons,
  activeLesson,
  activeLessonPercentage,
}) => {
  return (
    <>
      <UnitBanner title={title} description={description} />
      <div className={"flex items-center flex-col relative"}>
        {lessons.map((lesson, index) => {
          const isCurrent = lesson.id === activeLesson?.id;
          const isLocked = !lesson.completed && !isCurrent;

          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={index}
              totalCount={lessons.length - 1}
              current={isCurrent}
              locked={isLocked}
              percentage={activeLessonPercentage}
            />
          );
        })}
      </div>
    </>
  );
};
