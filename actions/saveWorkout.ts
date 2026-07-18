"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface Workout {
  workoutId: number;
  exercises: {
    id?: number;
    exerciseId: number;
    Exercises?: { id: number; name: string };
    WorkoutTemplateSets: {
      id: number;
      reps: number;
      finished: boolean;
      weight: number;
    }[];
  }[];
}
export async function saveWorkout(workout: Workout) {
  const cookieStore = await cookies();
  const database = createClient(cookieStore);
  // Lisää Workouts tauluun endTime -- DONE
  // Lisää WorkoutExercises tauluun exerciseId ja workoutId
  // lisää WorkoutSets tauluun reps,weight,order ja workoutExerciseId ^^ aiemmin luotu
  const cleanedWorkout = workout.exercises.map((exercise) => {
    const { Exercises, id, ...usefulFields } = exercise;
    return usefulFields;
  });
  // poistettu turhia kenttiä, kuten Exercises {id,name}, id rivi (templatesets id)
  /*
    {
    exerciseId: 2, <<LIIKKEEN ID
    WorkoutTemplateSets: [ 
    [
        { id: 22, reps: 21, order: 1, weight: 12, finished: true },
        { id: 23, reps: 3, order: 2, weight: 3, finished: true },
        { id: 24, reps: 0, order: 3, weight: 0, finished: true }
    ]
   ]
  }
  */
  const { data: newWorkoutData, error: newWorkoutError } = await database.rpc(
    "finishworkout",
    { workoutid: workout.workoutId, exercises: cleanedWorkout },
  );
  if (newWorkoutError) return console.error(newWorkoutError);

  redirect("/");
}
