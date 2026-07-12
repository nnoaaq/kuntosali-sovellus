import { ActiveWorkout } from "@/components/activeWorkout";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
interface WorkoutDataType {
  id: number;
  name: string;
  startTime: string;
  WorkoutTemplates: {
    id: number;
    name: string;
    WorkoutTemplateExercises: {
      exerciseId: number;
      id: number;
      workoutTemplateId: number;
      Exercises: {
        id: number;
        name: string;
      };
      WorkoutTemplateSets: {
        id: number;
        reps: number;
        weight: number;
      }[];
    }[];
  };
}
interface PageProps {
  params: Promise<{ id: string }>;
}
export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const dataBase = createClient(cookieStore);
  const { data: workoutData, error: workoutDataError } = await dataBase
    .from("Workouts")
    .select(
      `
        id,
        name,
        startTime,
        WorkoutTemplates(
        id,
        name,
        userId,
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
      )
      `,
    )
    .eq("id", id)
    .single<WorkoutDataType>();
  if (workoutDataError) console.error(workoutDataError);
  return (
    <div className="flex flex-col items-center w-full min-h-screen justify-center p-2">
      {workoutData && <ActiveWorkout {...workoutData} />}
    </div>
  );
}
