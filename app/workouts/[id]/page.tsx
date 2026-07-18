import { ActiveWorkout } from "@/app/components/logWorkout";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
interface Workout {
  id: number;
  name: string;
  startTime: string;
  endTime: string | null;
  WorkoutTemplates: {
    id: number;
    WorkoutTemplateExercises: {
      id: number;
      Exercises: { id: number; name: string };
      exerciseId: number;
      WorkoutTemplateSets: {
        id: number;
        reps: number;
        weight: number;
        order: number;
        finished: boolean;
      }[];
    }[];
  };
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
    .from("Workouts")
    .select(
      `
       id,
       name,
       startTime,
       endTime,
        WorkoutTemplates(
        id,
          WorkoutTemplateExercises(
          id,
          Exercises(id,name),
          exerciseId,
            WorkoutTemplateSets(id,reps,weight,order)
          )
        )
      )
        `,
    )
    .eq("id", paramsData.id)
    .single()) as { data: Workout; error: any };
  if (workoutError) console.error(workoutError);

  return (
    <div className="flex p-2 justify-center min-h-screen bg-zinc-950">
      <ActiveWorkout workout={workoutData} />
    </div>
  );
}
