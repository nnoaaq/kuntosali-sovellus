import { ActiveWorkout } from "@/app/components/logWorkout";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
interface Workout {
  id: number;
  name: string;
  exercises: {
    id: number;
    sets: { id: number; reps: number; order: number; weight: number }[];
  }[];
}
export default async function Home({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const paramsData = await params;
  // paramsData {id:string}
  const cookieStore = await cookies();
  const database = await createClient(cookieStore);
  const { data: workoutData, error: workoutError } = (await database
    .from("WorkoutTemplates")
    .select(
      `
        id, name,
        exercises : WorkoutTemplateExercises (id,sets: WorkoutTemplateSets (id,order,reps,weight))
        )
        `,
    )
    .eq("id", paramsData.id)
    .single()) as { data: Workout; error: any };
  if (workoutError) console.error(workoutError);

  return (
    <div className="flex p-2 justify-center min-h-screen">
      <ActiveWorkout workout={workoutData} />
    </div>
  );
}
