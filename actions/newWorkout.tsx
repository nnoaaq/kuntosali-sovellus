"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface Workout {
  name: string;
  exercises: {
    id: number;
    sets: {
      order: number;
      reps: number;
      weight: number;
    }[];
  }[];
}
export async function createNewWorkout(workout: Workout) {
  const cookieStore = await cookies();
  const database = await createClient(cookieStore);
  const { data: workoutTemplateId, error: workoutTemplateError } =
    await database.rpc("saveworkout", { workout: workout });
  if (workoutTemplateError) console.error(workoutTemplateError);
  redirect(`/workouts/${workoutTemplateId}`);
}
