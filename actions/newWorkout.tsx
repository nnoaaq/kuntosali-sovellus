"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface Workout {
  name: string;
  exercises: {
    id: number;
    name: string;
    sets: {
      id: string;
      order: number;
      reps: number;
      weight: number;
    }[];
  }[];
}
export async function createNewWorkout(workout: Workout) {
  const cookieStore = await cookies();
  const database = await createClient(cookieStore);
  const { data: workoutId, error: workoutError } = await database.rpc(
    "saveworkout",
    { workout: workout },
  );
  if (workoutError) return console.error(workoutError);
  if (!workoutId) return console.error("ID JÄI MATKALLE ");
  redirect(`/workouts/${workoutId}`);
}
