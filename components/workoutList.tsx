import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { WorkoutCard } from "./workoutCard";
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
        name: string;
      };
    }[];
  }
  const cookieStore = await cookies();
  const database = await createClient(cookieStore);
  const { data: workouts, error } = await database.from("Workouts")
    .select(`id,userId,startTime,endTime,name, workoutLogs: WorkoutLog(
        id,
        workoutId,
        exerciseId,
        exercises: Exercises(name),
        sets: Sets(
        id,
        weight,
        reps,
        workoutLogId) 
        )`);
  console.log("haetut tiedot tietokannassta");
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl py-2">Tehdyt salitreenit</h2>
      {workouts?.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout as any as workoutType} />
      ))}
    </div>
  );
}
