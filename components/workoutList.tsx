import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { WorkoutCard } from "./workoutCard";
import { WorkoutForm } from "./workoutNew";
export async function WorkoutList() {
  interface workoutType {
    id: number;
    userId: number;
    startTime: string;
    endTime: string | null;
    name: string;
    workoutLogs: {
      id: number;
      workoutId: number;
      exerciseId: number;
      sets: {
        id: number;
        weight: number;
        reps: number;
        workoutLogId: number;
      }[];
      exercises: {
        id: number;
        name: string;
      };
    }[];
  }
  const cookieStore = await cookies();
  const database = await createClient(cookieStore);
  const { data: exercises, error: exercisesError } = await database
    .from("Exercises")
    .select("id,name");
  const { data: workouts, error } = await database.from("Workouts")
    .select(`id,userId,startTime,endTime,name, workoutLogs: WorkoutLog(
        id,
        workoutId,
        exerciseId,
        exercises: Exercises(id,name),
        sets: Sets(
        id,
        weight,
        reps,
        workoutLogId) 
        )`);

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col gap-2">
      <h2 className="text-2xl py-2">Tehdyt salitreenit</h2>
      <button className="p-3 border border-green-400 bg-green-600 w-full rounded-md text-white font-bold hover:bg-green-800 cursor-pointer">
        Aloita uusi treeni
      </button>
      <WorkoutForm exercises={exercises || []} />

      {workouts?.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout as any as workoutType} />
      ))}
    </div>
  );
}
