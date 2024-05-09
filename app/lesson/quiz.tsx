"use client";

import { FC, useMemo, useState, useTransition } from "react";
import { useAudio, useMount } from "react-use";

import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

import { toast } from "sonner";
import { POINT_PER_CHALLENGE } from "@/constants";

import { getUserSubscription } from "@/db/queries";
import { challengeOptions, challenges } from "@/db/schema";

import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { ResultCard } from "./result-card";

import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";

import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

const Challenge = dynamic(
  () => import("./challenge").then((mod) => mod.Challenge),
  { ssr: false },
);

const Footer = dynamic(() => import("./footer").then((mod) => mod.Footer), {
  ssr: false,
});

type QuizProps = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: typeof challenges.$inferSelect.lessonId;
  initialLessonChallenges: Array<
    typeof challenges.$inferSelect & {
      completed: boolean;
      challengeOptions: Array<typeof challengeOptions.$inferSelect>;
    }
  >;
  userSubscription: Awaited<ReturnType<typeof getUserSubscription>>;
};

export const Quiz: FC<QuizProps> = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
}) => {
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  useMount(() => {
    if (initialPercentage === 100) openPracticeModal();
  });

  const router = useRouter();
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, _ic, incorrectControls] = useAudio({
    src: "/incorrect.wav",
  });
  const [finishAudio] = useAudio({
    src: "/finish.mp3",
    autoPlay: true,
  });

  const [pending, startTransition] = useTransition();

  const [lessonId] = useState(initialLessonId);
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });
  const [challenges, setChallenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed,
    );

    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });
  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

  const challenge = useMemo(
    () => challenges[activeIndex],
    [activeIndex, challenges],
  );
  const options = challenge?.challengeOptions ?? [];

  const onNext = () => {
    setActiveIndex((prev) => prev + 1);
  };

  const onContinue = () => {
    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    } else if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.correct);

    if (correctOption && correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            correctControls.play();

            setStatus("correct");
            setPercentage((prev) => {
              const newPercentage = prev + 100 / challenges.length;
              return Math.min(newPercentage, 100);
            });

            // This is a practice
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch((error) => {
            console.error(error);
            toast.error("An error occurred. Please try again.");
          });
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            incorrectControls.play();
            setStatus("wrong");

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch((error) => {
            console.error(error);
            toast.error("An error occurred. Please try again.");
          });
      });
    }
  };

  const onSelect = (id: number) => {
    if (status !== "none") return;

    setSelectedOption(id);
  };

  if (!challenge) {
    return (
      <>
        <div
          className={
            "flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full"
          }
        >
          {finishAudio}

          <Image
            src={"/finish.svg"}
            alt={"Finish"}
            className={"hidden lg:block"}
            height={100}
            width={100}
          />
          <Image
            src={"/finish.svg"}
            alt={"Finish"}
            className={"block lg:hidden"}
            height={50}
            width={50}
          />
          <h1 className={"text-xl lg:text-3xl font-bold text-neutral-700"}>
            Great job! <br /> You&apos;ve completed this lesson.
          </h1>
          <div className={"flex items-center gap-x-4 w-full"}>
            <ResultCard
              variant={"points"}
              value={challenges.length * POINT_PER_CHALLENGE}
            />
            <ResultCard variant={"hearts"} value={hearts} />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status={"completed"}
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }

  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning."
      : challenge.question;

  return (
    <>
      {correctAudio}
      {incorrectAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className={"flex-1"}>
        <div className={"h-full flex items-center justify-center"}>
          <div
            className={
              "lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12"
            }
          >
            <h1
              className={
                "text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700"
              }
            >
              {title}
            </h1>
            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={pending}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};
