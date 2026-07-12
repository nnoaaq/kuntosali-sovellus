"use client";
import { formatTime } from "@/utils/time";

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

export function ActiveWorkout(workoutData: WorkoutDataType) {
  console.log("----_____-----");
  console.log(workoutData);
  async function finishWorkout() {
    console.log("MITEN LOPETETAAN???? MISTÄ DATA");
  }
  function setCompleted(set: any) {
    console.log("setti valmis:", set);
  }
  return (
    <div className="flex flex-col gap-3 p-2 border max-w-md w-full mx-auto border-stone-400 rounded-sm shadow-md bg-stone-100">
      <div>
        <p>{workoutData.name}</p>
        <p className="font-semibold text-gray-400">
          {formatTime(workoutData.startTime)}
        </p>
      </div>
      {workoutData.WorkoutTemplates.WorkoutTemplateExercises.map(
        (exercises) => (
          <div
            key={exercises.id}
            className="border border-stone-300 bg-white p-1 rounded-sm shadow"
          >
            <div>
              <p className="pb-1.5">{exercises.Exercises.name}</p>
            </div>
            <div className="flex flex-col gap-2">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="w-10"></th>
                    <th className="text-gray-400 uppercase text-xs text-center py-2 font-semibold w-12">
                      sarja
                    </th>
                    <th className="text-gray-400 uppercase text-xs text-center py-2 font-semibold">
                      toistot
                    </th>
                    <th className="text-left w-10"></th>
                    <th className="text-gray-400 uppercase text-xs text-center py-2 font-semibold">
                      painot
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {exercises.WorkoutTemplateSets.map((set, index) => (
                    <tr
                      key={index}
                      className="border-b border-stone-100 last:border-none"
                    >
                      <td className="pl-2">
                        <label className="flex items-center gap-3 cursor-pointer group select-none">
                          <input
                            onChange={() =>
                              setCompleted({
                                order: index + 1,
                                reps: set.reps,
                                weight: set.weight,
                                id: set.id,
                                exerciseId: exercises.Exercises.id,
                              })
                            }
                            type="checkbox"
                            className="sr-only peer"
                          />
                          <div className="w-6 h-6 border border-gray-400 rounded-xl peer-checked:bg-green-600"></div>
                        </label>
                      </td>
                      <td className="text-center py-2.5 text-sm font-medium text-stone-500">
                        #{index + 1}
                      </td>
                      <td className="text-center py-2.5 font-medium">
                        <input
                          type="number"
                          className="[appearance:textfield] border border-stone-300 w-12 p-1 text-center rounded-xs "
                          name="reps"
                          placeholder={String(set.reps)}
                        />
                      </td>
                      <td className="text-center py-2.5 text-gray-400 text-sm">
                        x
                      </td>
                      <td className="text-center py-2.5 font-medium">
                        <input
                          type="number"
                          className="[appearance:textfield] border border-stone-300 w-12 p-1 text-center rounded-xs "
                          name="weight"
                          placeholder={String(set.weight)}
                        />
                      </td>
                      <td className="text-left py-2.5 text-sm text-gray-500">
                        kg
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ),
      )}
      <div>
        <button
          onClick={finishWorkout}
          className="w-full bg-green-600 p-2 rounded-sm hover:text-white hover:bg-green-800 cursor-pointer"
        >
          Lopeta harjoitus
        </button>
      </div>
    </div>
  );
}
