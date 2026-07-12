"use client";
import { saveWorkoutTemplate } from "@/actions/workout";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
interface createdExercise {
  exercise: { id: number; name: string };
  sets: { id: number; reps: number; weight: number }[];
}
export function WorkoutForm({
  exercises,
}: {
  exercises: { id: number; name: string }[];
}) {
  const router = useRouter();
  console.log("exercises : ", exercises);
  const [newExerciseSets, setNewExerciseSets] = useState([
    {
      id: 1,
      reps: 0,
      weight: 0,
    },
  ]);
  const [newExercises, setNewExercises] = useState<createdExercise[]>([]);
  const [newExerciseId, setNewExerciseId] = useState("0");
  function updateSet(id: number, field: string, value: string) {
    setNewExerciseSets((oldSets) =>
      oldSets.map((set) =>
        set.id === id ? { ...set, [field]: Number(value) } : set,
      ),
    );
  }
  async function saveExercise() {
    const workoutTemplateData = await saveWorkoutTemplate(newExercises);
    // {success:boolean,error:false/syy,id:number}
    // id = luotu workoutTemplateId

    if (workoutTemplateData.success) {
      // Kaikki ok > treenipohja luotu onnistuneesti
      setNewExercises([]);
      router.push(`/workout/${workoutTemplateData.id}`);
    }
  }
  function addExercise() {
    const foundExercise = exercises.find((e) => e.id === Number(newExerciseId));
    if (!foundExercise) {
      return;
    }
    const createdExercise: createdExercise = {
      exercise: foundExercise,
      sets: newExerciseSets,
    };
    setNewExercises((oldExercises) => [...oldExercises, createdExercise]);
    setNewExerciseSets([{ id: 1, reps: 0, weight: 0 }]);
    setNewExerciseId("0");
  }
  return (
    <>
      <div
        className={`border bg-gray-100 border-gray-400 rounded-sm shadow-md p-2 ${newExercises && newExercises.length > 0 ? "" : "hidden"}`}
      >
        <h3 className="text-lg font-bold">Lisätyt liikkeet ja sarjat</h3>
        {newExercises &&
          newExercises.map((exercise, index) => (
            <div
              key={index}
              className="border-b border-gray-400 p-2 flex flex-col"
            >
              <p className="pb-1.5">{exercise.exercise.name}</p>
              <div className="flex gap-2">
                {exercise.sets.map((set) => (
                  <div
                    key={set.id}
                    className="p-2 border bg-sky-100 border-gray-400 rounded-sm"
                  >
                    <p>
                      {set.reps} x {set.weight} kg
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        <button
          onClick={saveExercise}
          className="p-2 border border-green-700 bg-green-700 text-white w-full mt-2 rounded-sm hover:bg-green-800 cursor-pointer"
        >
          Tallenna harjoitus
        </button>
      </div>
      <form className="flex flex-col gap-2 border border-gray-400 rounded-md shadow-md p-2">
        <div>
          <h3 className="pb-1.5">Lisää uusi liike</h3>
          <select
            value={newExerciseId}
            onChange={(e) => setNewExerciseId(e.target.value)}
            name="exerciseId"
            className="p-2 border border-gray-400 bg-gray-200 rounded-sm w-full"
          >
            <option value="0">Valitse harjoitus</option>
            {exercises &&
              exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
          </select>
        </div>
        {newExerciseSets &&
          newExerciseSets.map((exercise) => (
            <div
              key={exercise.id}
              className="p-2 border border-gray-400 rounded-sm flex gap-2"
            >
              <div className="flex-1 flex items-center justify-center p-1 text-center ">
                <p className="text-lg">#{exercise.id}</p>
              </div>
              <div className="flex-1 p-1 text-center">
                <input
                  onChange={(e) =>
                    updateSet(exercise.id, "reps", e.target.value)
                  }
                  className="p-2 bg-gray-200 w-full border border-gray-400 rounded-md"
                  type="number"
                  name="exerciseReps"
                  placeholder="Toistoa"
                  value={exercise.reps === 0 ? "" : exercise.reps}
                />
              </div>
              <div className="flex-1 p-1 text-center">
                <input
                  onChange={(e) =>
                    updateSet(exercise.id, "weight", e.target.value)
                  }
                  className="p-2 bg-gray-200 w-full border border-gray-400 rounded-md"
                  type="number"
                  name="exerciseWeight"
                  placeholder="Paino (kg)"
                  value={exercise.weight === 0 ? "" : exercise.weight}
                />
              </div>
            </div>
          ))}
        <div>
          <button
            type="button"
            onClick={() =>
              setNewExerciseSets((oldSets) => [
                ...oldSets,
                { id: oldSets[oldSets.length - 1].id + 1, reps: 0, weight: 0 },
              ])
            }
            className="p-2 bg-blue-500 w-full text-white border border-blue-600 rounded-sm shadow-md hover:bg-blue-700 cursor-pointer"
          >
            Lisää uusi sarja
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={addExercise}
            className="p-2 bg-green-700 w-full text-white border border-green-600 rounded-sm shadow-md hover:bg-green-900 cursor-pointer"
          >
            Tallenna liike
          </button>
        </div>
      </form>
    </>
  );
}
