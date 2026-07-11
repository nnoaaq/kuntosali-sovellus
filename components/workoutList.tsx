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
    <div className="p-4 max-w-md mx-auto flex flex-col gap-2">
      <h2 className="text-2xl py-2">Tehdyt salitreenit</h2>
      <button className="p-3 border border-green-400 bg-green-600 w-full rounded-md text-white font-bold hover:bg-green-800">
        Aloita uusi treeni
      </button>
      <WorkoutForm />
      <form className="space-y-5 text-gray-800 max-w-md mx-auto p-1">
        {/* TREENIN NIMI */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
            Treenin nimi
          </label>
          <input
            type="text"
            placeholder="esim. Rantakuntoon, Jalat, Rinta..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            required
          />
        </div>

        {/* LIIKKEET-LISTA */}
        <div className="space-y-4">
          {/* LIIKEKORTTI */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-3 shadow-sm">
            {/* Otsikkorivi ja liikkeen valinta */}
            <div className="flex justify-between items-center gap-4 border-b border-gray-200/60 pb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Liike #1
              </span>
              <select className="text-sm font-semibold bg-transparent text-gray-700 outline-none cursor-pointer hover:text-blue-600 transition-colors">
                <option>Vinopenkki - smith</option>
                <option>Vipunostot käsipainoilla</option>
                <option>Kyykky tangolla</option>
              </select>
            </div>

            {/* SARJAT LIIKKEEN SISÄLLÄ */}
            <div className="space-y-2">
              {/* YKSITTÄINEN SARJA */}
              <div className="flex items-center justify-between gap-2 bg-white p-2 border border-gray-200/50 rounded-lg shadow-sm">
                <span className="text-xs font-medium text-gray-400 w-12 pl-1">
                  Sarja 1
                </span>

                {/* Paino ja toistot */}
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md px-2 py-1 w-20">
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full bg-transparent text-center text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-xs text-gray-400 ml-1">kg</span>
                  </div>

                  <span className="text-gray-300 font-light">×</span>

                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md px-2 py-1 w-20">
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full bg-transparent text-center text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-xs text-gray-400 ml-1">toistoa</span>
                  </div>
                </div>

                {/* Poistonappi (Roskakori) */}
                <button
                  type="button"
                  className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.34 6.6m-2.57 0L9.26 9m9.96-1-1.01 13.63a2.25 2.25 0 0 1-2.24 2.25H8.01a2.25 2.25 0 0 1-2.24-2.25L4.74 8m15.38 0F18.16 6.57 16.51 5 14.5 5H9.5c-2.01 0-3.66 1.57-4.24 3M4.74 8h15.38"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Lisää sarja -nappi kortin sisällä */}
            <button
              type="button"
              className="w-full py-1.5 border border-dashed border-gray-300 hover:border-blue-400 text-xs font-semibold text-gray-500 hover:text-blue-600 bg-white rounded-lg transition-colors"
            >
              + Lisää sarja
            </button>
          </div>
        </div>

        {/* TOIMINTAPAINIKKEET LOMAKKEEN POHJALLA */}
        <div className="pt-2 space-y-2">
          <button
            type="button"
            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-xl text-sm transition-colors shadow-sm"
          >
            + Lisää uusi liike treeniin
          </button>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-blue-500/10 active:scale-[0.99]"
          >
            Tallenna treeni suoritettuna
          </button>
        </div>
      </form>
      {workouts?.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout as any as workoutType} />
      ))}
    </div>
  );
}
