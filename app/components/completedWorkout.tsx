"use client";
import { useState } from "react";
import { calculateWorkoutDuration, formatTime } from "@/utils/time";
import { redirect } from "next/navigation";

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
export function CompletedWorkout(workout: WorkoutsDataType) {
  const [showExercises, setShowExercises] = useState(false);
  return (
    <div className="">
      <div className="flex flex-col gap-2">
        {workout && (
          <div
            key={workout.id}
            className={`flex flex-col gap-1 rounded-md bg-zinc-900/60 ${!workout.endTime && "border border-amber-900/60"}`}
          >
            <div
              onClick={() => setShowExercises(!showExercises)}
              className="p-2 pb-0 flex justify-between"
            >
              <div className="w-2/3">
                <p className="text-xl text-amber-400">{workout.name}</p>
                <p className="text-zinc-600 tracking-widest text-sm pb-2">
                  {formatTime(workout.startTime)}
                </p>
              </div>
              {workout.endTime ? (
                <div className="flex justify-center h-full p-1 rounded-lg bg-emerald-700 w-auto">
                  <span className="flex items-center gap-1 text-emerald-50 text-xs font-semibold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    {calculateWorkoutDuration(
                      workout.startTime,
                      workout.endTime,
                    )}{" "}
                    min
                  </span>
                </div>
              ) : (
                <div className="bg-yellow-950/60 rounded flex flex-col items-center justify-center h-full text-zinc-200">
                  <button
                    onClick={() => redirect(`/workouts/${workout.id}`)}
                    className="p-2 cursor-pointer hover:bg-yellow-950 rounded"
                  >
                    Jatka treeniä
                  </button>
                </div>
              )}
            </div>
            <div
              hidden={!showExercises}
              className="flex flex-col gap-4 p-2 bg-zinc-950"
            >
              {workout.WorkoutExercises.map((exercise) => (
                <div key={exercise.id}>
                  <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                    {exercise.Exercises.name}
                  </p>
                  <div className="flex flex-col gap-2">
                    <table>
                      <thead className="border-b border-zinc-900">
                        <tr className="border-b border-zinc-800">
                          <th className=" font-semibold text-zinc-500 w-12 p-2">
                            #
                          </th>
                          <th className=" font-semibold text-zinc-500  p-2">
                            Toistot
                          </th>
                          <th className=" font-semibold text-zinc-500  p-2">
                            Paino (kg)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {exercise.WorkoutSets.map((set) => (
                          <tr key={set.id} className="border-b border-zinc-800">
                            <td className="text-zinc-600 text-center p-1">
                              {set.order}
                            </td>
                            <td className="text-zinc-600 text-center">
                              {set.reps}
                            </td>
                            <td className="text-zinc-600 text-center">
                              {set.weight}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
