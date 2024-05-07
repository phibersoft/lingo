import { NextPage } from "next";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Header } from "@/app/(main)/learn/header";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";

const LearnPage: NextPage = async () => {
  const userProgressData = getUserProgress();

  const [userProgress] = await Promise.all([userProgressData]);

  if (!userProgress || !userProgress.activeCourseId) {
    redirect("/courses");
  }

  return (
    <div className={"flex flex-row-reverse gap-[48px] px-6"}>
      <StickyWrapper>
        <UserProgress
          activeCourse={{
            title: "Spanish",
            imageSrc: "/es.svg",
          }}
          hearts={15}
          points={250}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={"Spanish"} />
        <div className={"space-y-4"}></div>
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;
