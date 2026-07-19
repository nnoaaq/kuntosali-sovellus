import { cookies } from "next/headers";
import { CreateWorkout } from "./components/newWorkout";
import { createClient } from "@/utils/supabase/server";
import { CompletedWorkouts } from "./components/completedWorkouts";
interface Exercise {
  id: number;
  name: string;
  group: string;
}
export default async function Home() {
  const cookieStore = await cookies();
  const database = await createClient(cookieStore);
  const { data: exercisesData, error: exercisesError } = await database
    .from("Exercises")
    .select("id,name,group");
  if (exercisesError) console.log("VIRHE!!!");
  return (
    <div className="flex flex-col gap-2 p-2 items-center min-h-screen bg-neutral-950">
      <CreateWorkout exercises={(exercisesData as Exercise[]) || []} />
      <CompletedWorkouts />
    </div>
  );
}
