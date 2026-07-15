"use client";

import { formatTime } from "@/utils/time";
import { useState } from "react";

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
  const [errors, setErrors] = useState<
    | {
        id: Number;
        exercise: number;
        text: string;
      }[]
    | null
  >(null);
  const [currentWorkout, setCurrentWorkout] = useState({
    exercises: workout.WorkoutTemplates.WorkoutTemplateExercises.map(
      (exercise) => ({
        ...exercise,
        WorkoutTemplateSets: exercise.WorkoutTemplateSets.map((set) => ({
          ...set,
          finished: false,
        })),
      }),
    ),
  });
  if (!workout) return "ei workouttia";
  return (
    <div className="border h-full w-100 border-gray-400 rounded flex flex-col gap-2">
      <div className="border-b border-gray-400 p-2">
        <h3 className="text-xl">{workout.name}</h3>
        <p className="text-sm text-gray-500">{formatTime(workout.startTime)}</p>
      </div>
      <div>
        <div className="flex flex-col gap-2 p-2">
          {currentWorkout.exercises.map((workoutExercise) => (
            <div
              className="border border-gray-400 rounded p-2"
              key={workoutExercise.id}
            >
              <p>{workoutExercise.Exercises.name}</p>
              <div>
                {errors &&
                  errors.map(
                    (error) =>
                      error.exercise === workoutExercise.Exercises.id && (
                        <div
                          key={error.exercise}
                          className="mt-1.5 w-full border border-red-200 p-2 bg-red-100 rounded-md flex justify-between"
                        >
                          <p className="text-red-800">{error.text}</p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            color="red"
                            onClick={() => {
                              setErrors((prevErrors) =>
                                prevErrors
                                  ? prevErrors.filter(
                                      (err) =>
                                        err.exercise !==
                                        workoutExercise.Exercises.id,
                                    )
                                  : null,
                              );
                            }}
                            className="size-6 cursor-pointer"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </div>
                      ),
                  )}
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="w-6"></th>
                      <th className="w-6 text-gray-500 uppercase tracking-wide">
                        #
                      </th>
                      <th className="w-6 text-gray-500 uppercase tracking-wide">
                        Toistot
                      </th>
                      <th className="w-6 text-gray-500 uppercase tracking-wide"></th>
                      <th className="w-6 text-gray-500 uppercase tracking-wide">
                        Paino
                      </th>
                      <th className="w-6 text-gray-500 uppercase tracking-wide"></th>
                      <th className="cursor-pointer">
                        <svg
                          onClick={() => {
                            setCurrentWorkout((prevState) => {
                              return {
                                ...prevState,
                                exercises: prevState.exercises.map(
                                  (exercise, index) => {
                                    if (exercise.id === workoutExercise.id) {
                                      return {
                                        ...exercise,
                                        WorkoutTemplateSets: [
                                          ...exercise.WorkoutTemplateSets,
                                          {
                                            id: Date.now(),
                                            reps: 0,
                                            weight: 0,
                                            finished: false,
                                            order:
                                              exercise.WorkoutTemplateSets
                                                .length + 1,
                                          },
                                        ],
                                      };
                                    }
                                    return exercise;
                                  },
                                ),
                              };
                            });
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {workoutExercise.WorkoutTemplateSets.map((workoutSet) => (
                      <tr
                        className="w-full border-b border-gray-400"
                        key={workoutSet.id}
                      >
                        <td>
                          <div
                            onClick={() => {
                              console.log(currentWorkout);
                              setCurrentWorkout((prevState) => {
                                return {
                                  ...prevState,
                                  exercises: prevState.exercises.map(
                                    (exercise) => ({
                                      ...exercise,
                                      WorkoutTemplateSets:
                                        exercise.WorkoutTemplateSets.map(
                                          (set) =>
                                            set.id === workoutSet.id
                                              ? {
                                                  ...set,
                                                  finished: !set.finished,
                                                }
                                              : set,
                                        ),
                                    }),
                                  ),
                                };
                              });
                            }}
                            className={`border border-gray-400 mx-auto w-[15px] h-[15px] rounded-full hover:bg-green-600 cursor-pointer ${workoutSet.finished && "bg-green-600"}`}
                          ></div>
                        </td>
                        <td className="w-6 p-2 text-center">
                          {workoutSet.order}
                        </td>
                        <td className="w-6 p-2 text-center">
                          <input
                            onChange={(e) => {
                              setCurrentWorkout((prevState) => {
                                return {
                                  ...prevState,
                                  exercises: prevState.exercises.map(
                                    (exercise) => ({
                                      ...exercise,
                                      WorkoutTemplateSets:
                                        exercise.WorkoutTemplateSets.map(
                                          (set) =>
                                            set.id === workoutSet.id
                                              ? {
                                                  ...set,
                                                  reps: Number(e.target.value),
                                                }
                                              : set,
                                        ),
                                    }),
                                  ),
                                };
                              });
                            }}
                            placeholder={String(workoutSet.reps)}
                            type="number"
                            name="setReps"
                            className="p-2 text-center border border-gray-400 rounded w-15 bg-gray-100 [appearance:textfield]"
                          />
                        </td>
                        <td className="w-6 p-2 text-center">x</td>
                        <td className="w-6 p-2 text-center">
                          <input
                            onChange={(e) => {
                              setCurrentWorkout((prevState) => {
                                return {
                                  ...prevState,
                                  exercises: prevState.exercises.map(
                                    (exercise) => ({
                                      ...exercise,
                                      WorkoutTemplateSets:
                                        exercise.WorkoutTemplateSets.map(
                                          (set) =>
                                            set.id === workoutSet.id
                                              ? {
                                                  ...set,
                                                  weight: Number(
                                                    e.target.value,
                                                  ),
                                                }
                                              : set,
                                        ),
                                    }),
                                  ),
                                };
                              });
                            }}
                            placeholder={String(workoutSet.weight)}
                            type="number"
                            name="setWeight"
                            className="p-2 text-center border border-gray-400 rounded w-15 bg-gray-100 [appearance:textfield]"
                          />
                        </td>
                        <td className="w-6 p-2 text-center">kg</td>
                        <td className="w-6 text-center cursor-pointer">
                          <svg
                            onClick={() => {
                              setCurrentWorkout((prevState) => {
                                return {
                                  ...prevState,
                                  exercises: prevState.exercises.map(
                                    (exercise) => ({
                                      ...exercise,
                                      WorkoutTemplateSets:
                                        exercise.WorkoutTemplateSets.filter(
                                          (set) => set.id !== workoutSet.id,
                                        ),
                                    }),
                                  ),
                                };
                              });
                            }}
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
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        <div className="p-2 pt-0">
          <button
            onClick={() => {
              for (let exercise of currentWorkout.exercises) {
                const allSetsFinished = exercise.WorkoutTemplateSets.find(
                  (set) => set.finished === false,
                );
                if (allSetsFinished !== undefined) {
                  setErrors((prevErrors) => {
                    const errorExists = prevErrors?.some(
                      (err) => err.exercise === exercise.Exercises.id,
                    );

                    if (errorExists) return prevErrors;

                    const newError = {
                      id: Date.now(),
                      exercise: exercise.Exercises.id,
                      text: "Kaikki sarjat tulee olla suoritettuina.",
                    };

                    return prevErrors ? [...prevErrors, newError] : [newError];
                  });
                }
              }
            }}
            className="rounded-md border border-green-800 w-full p-2 bg-green-700 hover:bg-green-900 hover:text-white cursor-pointer"
          >
            Lopeta harjoitus
          </button>
        </div>
      </div>
    </div>
  );
}
