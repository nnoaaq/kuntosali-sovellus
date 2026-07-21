"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getExerciseList() {
  const cookieStore = await cookies();
  const database = createClient(cookieStore);

  const { data: exercisesData, error: exercisesError } = await database
    .from("Exercises")
    .select("id,name,group");
  if (exercisesError) {
    console.error(exercisesError);
    return [];
  }

  return exercisesData as { id: number; name: string; group: string }[];
}
