"use server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
interface exercise {
  exercise: { id: number; name: string };
  sets: { id: number; reps: number; weight: number }[];
}
export async function saveWorkoutTemplate(exercisesList: exercise[]) {
  console.log("vastaanotettu");
  console.log(exercisesList);
  const cookieStore = await cookies();
  const dataBase = createClient(cookieStore);
  // Ensiksi täytyy luoda WorkoutTemplate
  // id, userId, name
  const { data: workoutTemplate, error: workoutTemplateWorkError } =
    await dataBase
      .from("WorkoutTemplates")
      .insert({
        userId: 2,
        name: "Staattinen testitreeni",
      })
      .select("id")
      .single();
  const workoutTemplateId = workoutTemplate?.id;
  if (workoutTemplateWorkError)
    return {
      success: false,
      error: "Treenipohjan luonti epäonnistui [WorkoutTemplate]",
    };
  // WorkoutTemplate luotu > seuraavaksi WorkoutTemplateExercises
  // workoutTemplateId, exerciseId
  for (let exercise of exercisesList) {
    const {
      data: workoutTemplateExercises,
      error: workoutTemplateExercisesError,
    } = await dataBase
      .from("WorkoutTemplateExercises")
      .insert({
        workoutTemplateId: workoutTemplateId,
        exerciseId: exercise.exercise.id,
      })
      .select("id")
      .single();
    if (workoutTemplateExercisesError)
      return {
        success: false,
        error: "Treenipohjan luonti epäonnistui [WorkoutTemplateExercises]",
      };
    const workoutTemplateExerciseId = workoutTemplateExercises?.id;
    // workoutTemplateExercises tallennettu > lisätään seuraavaksi näihin harjoitteisiin setit
    for (let set of exercise.sets) {
      // WorkoutTemplateSets
      // workoutTemplateExerciseId, reps,weight
      const { data: workoutTemplateSets, error: workoutTemplateSetsError } =
        await dataBase
          .from("WorkoutTemplateSets")
          .insert({
            workoutTemplateExerciseId: workoutTemplateExerciseId,
            reps: set.reps,
            weight: set.weight,
          })
          .select("id")
          .single();
      if (workoutTemplateSetsError)
        return {
          success: false,
          error: "Treenipohjan luonti epäonnistui [WorkoutTemplateSets]",
        };
    }
  }
  return { success: true, error: false, id: workoutTemplateId };
}
