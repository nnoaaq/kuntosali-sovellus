import { cookies } from "next/headers";
import { CreateWorkout } from "./components/newWorkout";
import { createClient } from "@/utils/supabase/server";
interface Exercise {
  id: number;
  name: string;
}
export default async function Home() {
  const cookieStore = await cookies();
  const database = await createClient(cookieStore);
  const { data: exercisesData, error: exercisesError } = await database
    .from("Exercises")
    .select("id,name");
  if (exercisesError) console.log("VIRHE!!!");
  return (
    <div className="flex p-2 justify-center min-h-screen">
      <CreateWorkout exercises={(exercisesData as Exercise[]) || []} />
    </div>
  );
}
