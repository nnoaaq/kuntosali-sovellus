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
  const [errors, setErrors] = useState<{ exercise: number; text: string }[]>(
    [],
  );
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
  function removeSet(exerciseId: number, setId: number) {
    setWorkoutExercises((prevWorkoutExercises) =>
      prevWorkoutExercises
        .map((exercise) => {
          if (exercise.id !== exerciseId) {
            return exercise;
          }
          if (exercise.WorkoutTemplateSets.length > 1) {
            return {
              ...exercise,
              WorkoutTemplateSets: exercise.WorkoutTemplateSets.filter(
                (set) => set.id !== setId,
              ).map((set, index) => ({
                ...set,
                order: index + 1,
              })),
            };
          }
          return null;
        })
        .filter((exercise) => exercise !== null),
    );
  }
  function updateValue(
    newValue: number,
    exerciseId: number,
    setId: number,
    field: string,
  ) {
    setWorkoutExercises((prevWorkoutExercises) => {
      return prevWorkoutExercises.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        return {
          ...exercise,
          WorkoutTemplateSets: exercise.WorkoutTemplateSets.map((set) => {
            if (set.id === setId) {
              return {
                ...set,
                [field]: newValue,
              };
            }
            return set;
          }),
        };
      });
    });
  }
  function markSetCompleted(exerciseId: number, setId: number) {
    console.log(exerciseId);
    const updatedExercises = workoutExercises.map((exercise) => {
      if (exercise.id !== exerciseId) return exercise;
      return {
        ...exercise,
        WorkoutTemplateSets: exercise.WorkoutTemplateSets.map((set) => {
          if (set.id !== setId) return set;
          return { ...set, finished: !set.finished };
        }),
      };
    });
    setWorkoutExercises(updatedExercises);
    updatedExercises.forEach((exercise) => {
      if (exercise.id !== exerciseId) return;
      const setsUnfinished = exercise.WorkoutTemplateSets.some(
        (set) => !set.finished,
      );
      if (!setsUnfinished) {
        // poistetaan mahdollinen virhe
        setErrors((prevErrors) =>
          prevErrors.filter((error) => error.exercise !== exerciseId),
        );
      }
    });
  }
  function finishWorkout() {
    const createdErrors: { exercise: number; text: string }[] = [];
    // Tarkistetaan onko kaikki setit merkattu suoritetuksi
    workoutExercises.forEach((exercise) => {
      const setsUnfinished = exercise.WorkoutTemplateSets.some(
        (set) => !set.finished,
      );
      if (setsUnfinished)
        createdErrors.push({
          exercise: exercise.id,
          text: "Keskeneräisiä sarjoja",
        });
    });
    // Päivitetään näkymä
    setErrors(createdErrors);
    if (createdErrors.length === 0) {
      // Kaikki setit merkitty tehdyiksi
      saveWorkout({
        workoutId: workout.id,
        exercises: workoutExercises,
      });
    }
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
            {errors &&
              errors.some((error) => error.exercise === workoutExercise.id) && (
                <p className="text-amber-900 uppercase text-xs font-semibold">
                  Keskeneräisiä sarjoja
                </p>
              )}
            <table className="w-full border-separate border-spacing-y-1.5">
              <thead className="border-b border-zinc-800 text-zinc-500 text-sm ">
                <tr>
                  <th></th>
                  <th className="w-12 text-center">#</th>
                  <th className="whitespace-nowrap">Toistot</th>
                  <th className="whitespace-nowrap">Painot (kg)</th>
                </tr>
              </thead>
              <tbody>
                {workoutExercise.WorkoutTemplateSets.map((set, index) => (
                  <tr key={set.id}>
                    <td
                      className={`pl-3 sm:pl-0 rounded-l-2xl ${set.finished ? "bg-emerald-800/10" : "bg-zinc-900"}`}
                      onClick={() =>
                        markSetCompleted(workoutExercise.id, set.id)
                      }
                    >
                      <svg
                        className={`w-6 h-6 mx-auto text-emerald-800 hover:bg-emerald-800 rounded-full cursor-pointer ${set.finished && "bg-emerald-800"}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </td>
                    <td
                      className={`text-center py-2.5 ${set.finished ? "bg-emerald-800/10 " : "bg-zinc-900"}`}
                    >
                      {index + 1}
                    </td>
                    <td
                      className={`text-center py-2.5 ${set.finished ? "bg-emerald-800/10 " : "bg-zinc-900"}`}
                    >
                      <input
                        onChange={(e) =>
                          updateValue(
                            Number(e.target.value),
                            workoutExercise.id,
                            set.id,
                            "reps",
                          )
                        }
                        onFocus={(e) => e.target.select()}
                        className="[appearance:textfield] p-1 text-center border border-zinc-800 w-15 rounded-lg "
                        type="number"
                        name="workoutReps"
                        placeholder={String(set.reps)}
                      />
                    </td>
                    <td
                      className={`text-center py-2.5  ${set.finished ? "bg-emerald-800/10 " : "bg-zinc-900"}`}
                    >
                      <input
                        onChange={(e) =>
                          updateValue(
                            Number(e.target.value),
                            workoutExercise.id,
                            set.id,
                            "weight",
                          )
                        }
                        onFocus={(e) => e.target.select()}
                        className="[appearance:textfield] p-1 text-center border border-zinc-800 w-15 rounded-lg "
                        type="number"
                        name="workoutWeight"
                        placeholder={String(set.weight)}
                      />
                    </td>
                    <td
                      className={`pr-3 sm:pr-1 text-center py-2.5 rounded-r-2xl ${set.finished ? "bg-emerald-800/10" : "bg-zinc-900"}`}
                      onClick={() => removeSet(workoutExercise.id, set.id)}
                    >
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
            <button
              className="p-2 bg-zinc-900 w-full rounded-full text-md font-zinc-400 cursor-pointer hover:bg-zinc-900/60"
              onClick={() => addSet(workoutExercise.id)}
            >
              + Lisää sarja
            </button>
          </div>
        ))}
        <button
          onClick={() => finishWorkout()}
          className="p-2 w-full bg-emerald-800 cursor-pointer hover:bg-emerald-900 rounded-lg"
        >
          Lopeta treeni
        </button>
      </div>
    </div>
  );
}
