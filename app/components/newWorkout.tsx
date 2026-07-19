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
interface Exercises {
  id: number;
  name: string;
  sets: {
    id: string;
    order: number;
    reps: number;
    weight: number;
  }[];
}
export function CreateWorkout({
  exercises,
}: {
  exercises: { id: number; name: string; group: string }[];
}) {
  const [exerciseName, setExerciseName] = useState<string | null>(null);
  const [addedExercises, setAddedExercises] = useState<Exercises[]>([]);
  const [showGroup, setShowGroup] = useState<string>("Kädet");
  const [showForm, setShowForm] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [exerciseError, setExerciseError] = useState(false);
  const exerciseGroups = [
    ...new Set(exercises.map((exercise) => exercise.group)),
  ];
  function addSet(exerciseId: number) {
    setAddedExercises((prevAddedExercises) =>
      prevAddedExercises.map((addedExercise) => {
        if (addedExercise.id !== exerciseId) {
          return addedExercise;
        }
        return {
          ...addedExercise,
          sets: [
            ...addedExercise.sets,
            {
              id: crypto.randomUUID(),
              order: addedExercise.sets.length + 1,
              reps: 0,
              weight: 0,
            },
          ],
        };
      }),
    );
  }
  function updateSet(
    exerciseId: number,
    setId: string,
    value: number,
    field: string,
  ) {
    setAddedExercises((prevAddedExercises) =>
      prevAddedExercises.map((addedExercise) => {
        if (addedExercise.id !== exerciseId) {
          return addedExercise;
        }
        return {
          ...addedExercise,
          sets: addedExercise.sets.map((set) => {
            if (set.id !== setId) {
              return set;
            }
            return {
              ...set,
              [field]: value,
            };
          }),
        };
      }),
    );
  }
  function deleteSet(exerciseId: number, setId: string) {
    setAddedExercises((prevAddedExercises) =>
      prevAddedExercises
        .map((exercise) => {
          if (exercise.id !== exerciseId) {
            return exercise;
          }
          if (exercise.sets.length > 1) {
            return {
              ...exercise,
              sets: exercise.sets
                .filter((set) => set.id !== setId)
                .map((set, index) => ({
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
  function createWorkout() {
    console.log("LUodun harjoituksen tiedot:");
    console.log(addedExercises);
    if (!exerciseName) setNameError(true);
    if (addedExercises.length == 0) setExerciseError(true);
    // Nimi annettu ja liikkeitä lisätty
    if (exerciseName && addedExercises.length > 0) {
      createNewWorkout({
        name: exerciseName,
        exercises: addedExercises,
      });
    }
  }
  return (
    <div className="border border-zinc-900 w-full max-w-md text-zinc-200 rounded-md">
      <button
        onClick={() => setShowForm(!showForm)}
        hidden={showForm}
        className="p-2 w-full bg-emerald-800 rounded p-2 cursor-pointer hover:bg-emerald-900 uppercase tracking-wide font-semibold text-md"
      >
        Luo uusi treeni
      </button>
      <div hidden={!showForm} className="p-2">
        <div className="flex justify-between">
          <h3 className="text-yellow-600 uppercase font-semibold tracking-wide mb-1.5">
            Luo uusi treeni
          </h3>
          <button
            onClick={() => createWorkout()}
            className="bg-emerald-900 p-2 rounded hover:bg-emerald-950 cursor-pointer mt-1.5 w-50"
          >
            Aloita treeni
          </button>
        </div>
        <div>
          <div>
            <label
              htmlFor="workoutName"
              className="text-sm uppercase text-zinc-500 tracking-wider font-semibold"
            >
              Treenin nimi
            </label>{" "}
            <input
              onChange={(e) => {
                setExerciseName(e.target.value);
                setNameError(false);
              }}
              type="text"
              name="workoutName"
              placeholder="esim. Työntävät"
              className="p-2 border border-zinc-800 w-full rounded"
            />
            {nameError && (
              <div className="text-red-900 font-semibold text-xs uppercase tracking-wide">
                Treenillä on oltava nimi
              </div>
            )}
          </div>
          <div className="">
            <label className="text-sm uppercase text-zinc-500 tracking-wider font-semibold">
              Liikkeet
            </label>
            {exerciseError && (
              <div className="text-red-900 font-semibold text-xs uppercase tracking-wide pb-2">
                Vähintään yksi liike on lisättävä
              </div>
            )}
            <div className="w-full flex gap-2 overflow-x-auto scrollbar-none">
              {exerciseGroups.map((group) => (
                <div
                  onClick={() => {
                    setShowGroup(group);
                  }}
                  key={group}
                  className={`p-2 text-xs border border-zinc-800 rounded-md cursor-pointer ${showGroup == group && "bg-zinc-800"}`}
                >
                  {group}
                </div>
              ))}
            </div>
            <div className="mb-2 flex flex-col gap-1 mt-1.5 max-h-60 overflow-y-auto border border-zinc-800 rounded">
              {exercises
                .filter((exercise) => exercise.group === showGroup)
                .map((exercise) => (
                  <div
                    key={exercise.id}
                    className="p-2 border-b border-zinc-800 rounded text-zinc-500 uppercase text-sm flex gap-2 items-center"
                  >
                    <div
                      onClick={() => {
                        if (
                          !addedExercises.some(
                            (addedExercise) => addedExercise.id == exercise.id,
                          )
                        ) {
                          setAddedExercises((prevAddedExercises) => [
                            ...prevAddedExercises,
                            {
                              id: exercise.id,
                              name: exercise.name,
                              sets: [
                                {
                                  id: crypto.randomUUID(),
                                  order: 1,
                                  reps: 0,
                                  weight: 0,
                                },
                              ],
                            },
                          ]);
                          return setExerciseError(false);
                        }
                        // On jo lisätty > halutaan siis poistaa
                        setAddedExercises((prevAddedExercises) =>
                          prevAddedExercises.filter(
                            (addedExercise) => addedExercise.id !== exercise.id,
                          ),
                        );
                      }}
                      className={`border border-zinc-800 w-4 h-4 rounded cursor-pointer ${addedExercises.some((addedExercise) => addedExercise.id == exercise.id) && "bg-emerald-800"}`}
                    ></div>
                    <p className="">{exercise.name}</p>
                  </div>
                ))}
            </div>
            <div className="flex flex-col gap-2 ">
              {addedExercises &&
                addedExercises.map((addedExercise) => (
                  <div
                    key={addedExercise.id}
                    className="border border-zinc-900 p-2 rounded bg-zinc-900/60"
                  >
                    <p className="text-zinc-200">{addedExercise.name}</p>
                    <div>
                      <table className="w-full">
                        <thead className="border-b border-zinc-800 text-zinc-500">
                          <tr>
                            <th className="w-12 text-center">#</th>
                            <th className="">Toistot</th>
                            <th className="">Painot (kg)</th>
                            <th
                              className="w-4 p-2 cursor-pointer hover:text-emerald-700"
                              onClick={() => addSet(addedExercise.id)}
                            >
                              <p className="text-xs w-20 text-zinc-200 p-1 bg-emerald-900 rounded-lg hover:bg-emerald-950">
                                Lisää sarja
                              </p>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {addedExercise.sets.map((set, index) => (
                            <tr key={set.id}>
                              <td className="text-center py-2.5">
                                {index + 1}
                              </td>
                              <td className="text-center py-2.5">
                                <input
                                  onChange={(e) =>
                                    updateSet(
                                      addedExercise.id,
                                      set.id,
                                      Number(e.target.value),
                                      "reps",
                                    )
                                  }
                                  className="[appearance:textfield] p-1 text-center border border-zinc-800 w-15 rounded-lg "
                                  type="number"
                                  name="workoutReps"
                                  placeholder={String(set.reps)}
                                />
                              </td>
                              <td className="text-center py-2.5">
                                <input
                                  onChange={(e) =>
                                    updateSet(
                                      addedExercise.id,
                                      set.id,
                                      Number(e.target.value),
                                      "weight",
                                    )
                                  }
                                  className="[appearance:textfield] p-1 text-center border border-zinc-800 w-15 rounded-lg "
                                  type="number"
                                  name="workoutWeight"
                                  placeholder={String(set.weight)}
                                />
                              </td>
                              <td
                                onClick={() =>
                                  deleteSet(addedExercise.id, set.id)
                                }
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
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
