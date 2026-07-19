import { createClient } from "@/utils/supabase/server";
import { calculateWorkoutDuration, formatTime } from "@/utils/time";
import { cookies } from "next/headers";
import { CompletedWorkout } from "./completedWorkout";
interface WorkoutsDataType {
  id: number;
  name: string;
  startTime: string;
  endTime: string | null;
  WorkoutExercises: {
    id: number;
    Exercises: { name: string };
    WorkoutSets: {
      id: number;
      reps: number;
      weight: number;
      order: number;
    }[];
  }[];
}

export async function CompletedWorkouts() {
  const cookieStore = await cookies();
  const database = createClient(cookieStore);
  const { data, error: workoutsError } = await database
    .from("Workouts")
    .select(
      `
        id,
        name,
        startTime,
        endTime,
            WorkoutExercises(
            id,
            Exercises(name),
                WorkoutSets(
                id,
                reps,
                weight,
                "order"
                )
            )
        `,
    )
    .order("startTime", { ascending: false });
  if (workoutsError) console.error(workoutsError);
  const workouts = data as unknown as WorkoutsDataType[];
  return (
    <div className="rounded-xl shadow bg-zinc-950 border border-zinc-900 w-full max-w-md p-2">
      <h2 className="font-semibold text-amber-500 tracking-wide uppercase mb-1.5">
        Suoritetut treenit
      </h2>
      <div className="flex flex-col gap-2">
        {workouts.map((workout) => (
          <CompletedWorkout key={workout.id} {...workout} />
        ))}
      </div>
    </div>
  );
}
