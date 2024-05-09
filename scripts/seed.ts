import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, {
  schema,
});

const main = async () => {
  try {
    console.log("Seeding database...");

    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);

    console.log("Inserting courses...");
    await db.insert(schema.courses).values([
      { id: 1, title: "Spanish", imageSrc: "/es.svg" },
      { id: 2, title: "French", imageSrc: "/fr.svg" },
      { id: 3, title: "Italian", imageSrc: "/it.svg" },
      { id: 4, title: "Japanese", imageSrc: "/jp.svg" },
      { id: 5, title: "Croatian", imageSrc: "/hr.svg" },
    ]);

    console.log("Inserting units...");
    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1,
        title: "Unit 1",
        description: "Learn the basics of Spanish",
        order: 1,
      },
    ]);

    console.log("Inserting lessons...");
    await db.insert(schema.lessons).values([
      {
        id: 1,
        unitId: 1,
        title: "Nouns",
        order: 1,
      },
      {
        id: 2,
        unitId: 1,
        title: "Verbs",
        order: 2,
      },
      {
        id: 3,
        unitId: 1,
        title: "Adjectives",
        order: 3,
      },
      {
        id: 4,
        unitId: 1,
        title: "Pronouns",
        order: 4,
      },
      {
        id: 5,
        unitId: 1,
        title: "Prepositions",
        order: 5,
      },
    ]);

    console.log("Inserting challenges...");
    await db.insert(schema.challenges).values([
      {
        id: 1,
        lessonId: 1,
        question: 'Which one of these is the "the man"?',
        order: 1,
        type: "SELECT",
      },
      {
        id: 2,
        lessonId: 1,
        question: '"the man"',
        order: 2,
        type: "ASSIST",
      },
      {
        id: 3,
        lessonId: 1,
        question: 'Which one of these is the "the robot"?',
        order: 3,
        type: "SELECT",
      },
      {
        id: 4,
        lessonId: 2,
        question: 'Which one of these is the "the robot"?',
        order: 3,
        type: "SELECT",
      },
    ]);

    console.log("Inserting challenge options...");
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 1,
        imageSrc: "/man.svg",
        correct: true,
        text: "el hombre",
        audioSrc: "/es_man.mp3",
      },
      {
        challengeId: 1,
        imageSrc: "/woman.svg",
        correct: false,
        text: "la mujer",
        audioSrc: "/es_woman.mp3",
      },
      {
        challengeId: 1,
        imageSrc: "/robot.svg",
        correct: false,
        text: "el robot",
        audioSrc: "/es_robot.mp3",
      },
      {
        challengeId: 2,
        correct: true,
        text: "el hombre",
        audioSrc: "/es_man.mp3",
      },
      {
        challengeId: 2,
        correct: false,
        text: "la mujer",
        audioSrc: "/es_woman.mp3",
      },
      {
        challengeId: 2,
        correct: false,
        text: "el robot",
        audioSrc: "/es_robot.mp3",
      },
      {
        challengeId: 3,
        imageSrc: "/man.svg",
        correct: false,
        text: "el hombre",
        audioSrc: "/es_man.mp3",
      },
      {
        challengeId: 3,
        imageSrc: "/woman.svg",
        correct: false,
        text: "la mujer",
        audioSrc: "/es_woman.mp3",
      },
      {
        challengeId: 3,
        imageSrc: "/robot.svg",
        correct: true,
        text: "el robot",
        audioSrc: "/es_robot.mp3",
      },
    ]);

    console.log("Seeding finished.");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

main();
