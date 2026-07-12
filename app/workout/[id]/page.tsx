import { ActiveWorkout } from "@/components/activeWorkout";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
interface workoutTemplate {
  id: number;
  userId: number;
  name: string;
  WorkoutTemplateExercises: {
    id: number;
    exerciseId: number;
    Exercises: { name: string; id: number };
    workoutTemplateId: number;
    WorkoutTemplateSets: {
      id: number;
      reps: number;
      weight: number;
      workoutTemplateExerciseId: number;
    }[];
  }[];
}
interface PageProps {
  params: Promise<{ id: string }>;
}
export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const dataBase = createClient(cookieStore);
  const { data: workoutTemplateData, error: workoutTemplateError } =
    await dataBase
      .from("WorkoutTemplates")
      .select(
        `
        id,
        userId,
        name,
        WorkoutTemplateExercises (
          id,
          workoutTemplateId,
          exerciseId,
          Exercises(id,name),
          WorkoutTemplateSets (
            id,
            workoutTemplateExerciseId,
            reps,
            weight
          )
        )
      `,
      )
      .eq("id", id)
      .single<workoutTemplate>();
  if (workoutTemplateError) console.error(workoutTemplateError);

  return (
    <div className="flex flex-col items-center w-full min-h-screen justify-center p-2">
      {workoutTemplateData && (
        <ActiveWorkout workoutTemplateData={workoutTemplateData} />
      )}
    </div>
  );
}
