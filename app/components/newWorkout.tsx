"use client";
import { createNewWorkout } from "@/actions/newWorkout";
import { useState } from "react";

interface Workout {
  name: string;
  exercises: {
    id: number;
    sets: {
      order: number;
      reps: number;
      weight: number;
    }[];
  }[];
}
export function CreateWorkout({
  exercises,
}: {
  exercises: { id: number; name: string }[];
}) {
  const [newExercise, setNewExercise] = useState<number | null>(null);
  const [error, setError] = useState<{ id: number; text: string } | null>();
  const [formVisible, setFormVisible] = useState(true);
  const [workout, setWorkout] = useState<Workout>({ name: "", exercises: [] });
  return (
    <div className="w-full max-w-md">
      {error && (
        <div className="border border-red-200 p-2 rounded mb-2 bg-red-100 flex justify-between">
          <p className="text-red-700">{error.text}</p>
          <svg
            onClick={() => setError(null)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            color="red"
            className="size-6  cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
      )}
      <button
        hidden={formVisible}
        onClick={() => setFormVisible(!formVisible)}
        className="border border-green-800 bg-green-600 p-2 w-full rounded hover:bg-green-700 cursor-pointer"
      >
        Luo uusi harjoitus
      </button>
      {formVisible && (
        <div className="p-2 border border-gray-400 rounded shadow">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col">
              <label
                htmlFor="workoutName"
                className="text-gray-500 uppercase font-semibold text-xs tracking-widest "
              >
                Treenin nimi
              </label>

              <input
                onBlur={(e) => {
                  if (error?.id == 1) setError(null);
                  setWorkout((prevWorkout) => ({
                    ...prevWorkout,
                    name: e.target.value,
                  }));
                }}
                type="text"
                name="workoutName"
                placeholder="esim. Työntävät"
                className="border border-gray-400 p-2  mt-1.5 w-full rounded placeholder:text-gray-400 placeholder:text-sm placeholder:italic"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="workoutName"
                className="text-gray-500 mt-1.5 uppercase font-semibold text-xs tracking-widest "
              >
                Lisää liike
              </label>

              <div className="flex justify-between border border-gray-400 rounded">
                <select
                  onChange={(e) => {
                    if (error?.id == 2) setError(null);
                    if (
                      !workout.exercises.some(
                        (exercise) => exercise.id === Number(e.target.value),
                      )
                    ) {
                      if (e.target.value !== "0") {
                        return setNewExercise(Number(e.target.value));
                      }
                      setNewExercise(null);
                    }
                  }}
                  name="exerciseName"
                  id=""
                  className="p-2 w-full"
                >
                  <option value="0">Valitse liike listasta</option>
                  {exercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    console.log(newExercise);
                    if (newExercise) {
                      if (
                        workout.exercises.some(
                          (exercise) => exercise.id === newExercise,
                        )
                      ) {
                        return setError({
                          id: 3,
                          text: "Valittu liike on jo lisätty harjoitukseen",
                        });
                      }
                      setWorkout((prevWorkout) => ({
                        ...prevWorkout,
                        exercises: [
                          ...prevWorkout.exercises,
                          {
                            id: Number(newExercise),
                            sets: [{ order: 1, reps: 0, weight: 0 }],
                          },
                        ],
                      }));
                    }
                  }}
                  className="p-2 bg-blue-500 text-white w-30 hover:bg-blue-600 cursor-pointer text-gray-500 "
                >
                  Lisää
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              {workout.exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="border border-gray-400 rounded shadow p-2"
                >
                  <p>
                    {exercises.find((item) => item.id === exercise.id)?.name}
                  </p>
                  <table key={exercise.id} className="w-full mt-1">
                    <thead>
                      <tr>
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
                        <th
                          onClick={(e) => {
                            setWorkout((prevWorkout) => ({
                              ...prevWorkout,
                              exercises: prevWorkout.exercises.map((item) => {
                                if (item.id === exercise.id) {
                                  return {
                                    ...item,
                                    sets: [
                                      ...item.sets,
                                      {
                                        order: item.sets.length + 1,
                                        reps: 0,
                                        weight: 0,
                                      },
                                    ],
                                  };
                                }
                                return item;
                              }),
                            }));
                          }}
                          className="w-6 text-gray-500 uppercase tracking-wide"
                        >
                          <svg
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
                      {exercise.sets.map((set) => (
                        <tr
                          key={set.order}
                          className=" border-b border-gray-400"
                        >
                          <td className="w-6 p-2 text-center">{set.order}</td>
                          <td className="w-6 p-2 text-center">
                            <input
                              onChange={(e) => {
                                setWorkout((prevWorkout) => ({
                                  ...prevWorkout,
                                  exercises: prevWorkout.exercises.map(
                                    (item) => {
                                      if (item.id === exercise.id) {
                                        return {
                                          ...item,
                                          sets: item.sets.map((s) =>
                                            s.order === set.order
                                              ? {
                                                  ...s,
                                                  reps: Number(e.target.value),
                                                }
                                              : s,
                                          ),
                                        };
                                      }
                                      return item;
                                    },
                                  ),
                                }));
                              }}
                              placeholder={String(set.reps)}
                              type="number"
                              name="setReps"
                              className="p-2 text-center border border-gray-400 rounded w-15 bg-gray-100 [appearance:textfield]"
                            />
                          </td>
                          <td className="w-6 p-2 text-center">x</td>
                          <td className="w-6 p-2 text-center">
                            <input
                              onChange={(e) => {
                                setWorkout((prevWorkout) => ({
                                  ...prevWorkout,
                                  exercises: prevWorkout.exercises.map(
                                    (item) => {
                                      if (item.id === exercise.id) {
                                        return {
                                          ...item,
                                          sets: item.sets.map((s) =>
                                            s.order === set.order
                                              ? {
                                                  ...s,
                                                  weight: Number(
                                                    e.target.value,
                                                  ),
                                                }
                                              : s,
                                          ),
                                        };
                                      }
                                      return item;
                                    },
                                  ),
                                }));
                              }}
                              placeholder={String(set.weight)}
                              type="number"
                              name="setWeight"
                              className="p-2 text-center border border-gray-400 rounded w-15 bg-gray-100 [appearance:textfield]"
                            />
                          </td>
                          <td className="w-6 p-2 text-center">kg</td>
                          <td
                            onClick={() => {
                              setWorkout((prevWorkout) => ({
                                ...prevWorkout,
                                exercises: prevWorkout.exercises.flatMap(
                                  (item) => {
                                    if (item.id === exercise.id) {
                                      const updatedSets = item.sets.filter(
                                        (s) => s.order !== set?.order,
                                      );
                                      if (updatedSets.length === 0) {
                                        return [];
                                      }
                                      return [
                                        {
                                          ...item,
                                          sets: updatedSets.map((s, index) => ({
                                            ...s,
                                            order: index + 1,
                                          })),
                                        },
                                      ];
                                    }
                                    return [item];
                                  },
                                ),
                              }));
                            }}
                            className="w-6 text-center"
                          >
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
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
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
            <div>
              <button
                className="border border-green-600 bg-green-600 text-white p-2 w-full mt-1.5 rounded hover:bg-green-700 cursor-pointer"
                type="button"
                onClick={() => {
                  if (workout.name.length == 0) {
                    return setError({
                      id: 1,
                      text: "Harjoituksella on oltava nimi",
                    });
                  }
                  if (workout.exercises.length == 0) {
                    return setError({
                      id: 2,
                      text: "Lisää harjoitukseen vähintään yksi liike",
                    });
                  }
                  createNewWorkout(workout);
                }}
              >
                Aloita harjoitus
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
