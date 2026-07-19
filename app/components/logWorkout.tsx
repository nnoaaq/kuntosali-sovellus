"use client";

import { saveWorkout } from "@/actions/saveWorkout";
import { formatTime } from "@/utils/time";
import { useEffect, useState } from "react";
import { WorkoutDuration } from "./workouDuration";
interface Workout {
  id: number;
  name: string;
  startTime: string;
  endTime: string | null;
  WorkoutTemplates: {
    id: number;
    WorkoutTemplateExercises: {
      id: number;
      exerciseId: number;
      Exercises: { id: number; name: string };
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
export function ActiveWorkout({ workout }: { workout: Workout }) {
  const [workoutExercises, setWorkoutExercises] = useState(
    workout.WorkoutTemplates.WorkoutTemplateExercises,
  );
  function addSet(exerciseId: number) {
    setWorkoutExercises((prevWorkoutExercises) =>
      prevWorkoutExercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            WorkoutTemplateSets: [
              ...exercise.WorkoutTemplateSets,
              {
                id: Date.now(), // "alkuperäisissä" on numero tietokannasta
                reps: 0,
                weight: 0,
                order: exercise.WorkoutTemplateSets.length + 1,
                finished: false,
              },
            ],
          };
        }
        return exercise;
      }),
    );
  }
  if (!workout) return "ei workouttia";
  return (
    <div className="border border-zinc-800 w-full max-w-md rounded bg-zinc-950 text-zinc-200">
      <div className="p-2 flex justify-between">
        <div>
          <h3 className="text-xl text-amber-400 tracking-wide">
            {workout.name}
          </h3>
          <p className="text-zinc-600 tracking-widest text-sm pb-2">
            {formatTime(workout.startTime)}
          </p>
        </div>
        <WorkoutDuration startTime={workout.startTime} />
      </div>
      <div className="flex flex-col gap-2 p-2">
        {workoutExercises.map((workoutExercise) => (
          <div
            key={workoutExercise.id}
            className="border border-zinc-900 p-2 rounded-lg bg-zinc-900/40"
          >
            <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              {workoutExercise.Exercises.name}
            </p>
            <table className="w-full">
              <thead className="border-b border-zinc-800 text-zinc-500 text-sm ">
                <tr>
                  <th className="w-12 text-center">#</th>
                  <th className="whitespace-nowrap">Toistot</th>
                  <th className="whitespace-nowrap">Painot (kg)</th>
                  <th
                    onClick={() => addSet(workoutExercise.id)}
                    className="w-4 p-2 cursor-pointer hover:text-emerald-700"
                  >
                    <p className="text-xs w-20 text-zinc-200 p-1 bg-emerald-900 rounded-lg hover:bg-emerald-950">
                      Lisää sarja
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {workoutExercise.WorkoutTemplateSets.map((set, index) => (
                  <tr key={set.id}>
                    <td className="text-center py-2.5">{index + 1}</td>
                    <td className="text-center py-2.5">
                      <input
                        className="[appearance:textfield] p-1 text-center border border-zinc-800 w-15 rounded-lg "
                        type="number"
                        name="workoutReps"
                        placeholder={String(set.reps)}
                      />
                    </td>
                    <td className="text-center py-2.5">
                      <input
                        className="[appearance:textfield] p-1 text-center border border-zinc-800 w-15 rounded-lg "
                        type="number"
                        name="workoutWeight"
                        placeholder={String(set.weight)}
                      />
                    </td>
                    <td>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4 mx-auto hover:text-red-800 cursor-pointer"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14"
                        />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
