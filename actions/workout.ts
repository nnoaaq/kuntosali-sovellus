"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
interface AddedExercise {
  workoutName: string;
  exerciseName: { id: number; name: string };
  exerciseSets: number;
  exerciseReps: number;
  exerciseWeight: number;
}
export async function saveExercises(exerciseList: AddedExercise[]) {
  const cookieStore = await cookies();
  const database = createClient(cookieStore);
  const { data: workoutData, error: workoutDataError } = await database
    .from("Workouts")
    .insert({
      userId: 1,
      name: exerciseList[0].workoutName,
    })
    .select("id")
    .single();
  if (workoutDataError) console.error(workoutDataError);
  const createdWorkoutId = workoutData?.id;
  console.log("workout ok=", createdWorkoutId);
  for (let exercise of exerciseList) {
    const { data: WorkoutLogData, error: WorkoutLogError } = await database
      .from("WorkoutLog")
      .insert({
        workoutId: createdWorkoutId,
        exerciseId: exercise.exerciseName.id,
      })
      .select("id")
      .single();
    if (WorkoutLogError) console.error(WorkoutLogError);
    const createdWorkoutLogId = WorkoutLogData?.id;
    const setsToInsert = [];

    for (let i = 0; i < exercise.exerciseSets; i++) {
      setsToInsert.push({
        workoutLogId: createdWorkoutLogId,
        reps: exercise.exerciseReps,
        weight: exercise.exerciseWeight,
      });
    }
    const { error: SetsError } = await database
      .from("Sets")
      .insert(setsToInsert);
  }
  console.log("TÄÄLLÄ OLLAAN");
}
