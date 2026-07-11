"use client";
import React, { useState } from "react";
import { saveExercises } from "@/actions/workout";
interface AddedExercise {
  workoutName: string;
  exerciseName: { id: number; name: string };
  exerciseSets: number;
  exerciseReps: number;
  exerciseWeight: number;
}
export function WorkoutForm({
  exercises,
}: {
  exercises: { id: number; name: string }[];
}) {
  const [addedExercises, setAddedExercises] = useState<AddedExercise[]>([]);
  function addExercise(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const foundExercise = exercises.find(
      (exercisesList) =>
        exercisesList.id === Number(formData.get("exerciseName")),
    );
    const exerciseObj: { id: number; name: string } = foundExercise || {
      id: 0,
      name: "Tuntematon liike",
    };
    const createdExercise: AddedExercise = {
      workoutName: String(formData.get("workoutName")),
      exerciseName: exerciseObj,
      exerciseSets: Number(formData.get("exerciseSets") || 0),
      exerciseReps: Number(formData.get("exerciseReps") || 0),
      exerciseWeight: Number(formData.get("exerciseWeight") || 0),
    };
    setAddedExercises((oldExercises) => [...oldExercises, createdExercise]);
  }
  async function saveWorkout() {
    saveExercises(addedExercises);
  }
  return (
    <form
      className="border p-2 rounded-md flex flex-col gap-2"
      onSubmit={addExercise}
    >
      <h2 className="text-2xl">Lisätyt liikkeet</h2>
      {addedExercises &&
        addedExercises.map((addedExercise, index) => (
          <div
            key={index}
            className="flex flex-col border bg-gray-50 border-gray-200 p-2 rounded-sm shadow-sm"
          >
            <h3 className="mb-1 border-b border-gray-400 text-xl pb-1">
              {addedExercise.exerciseName.name}
            </h3>
            <table>
              <thead className="border-b">
                <tr>
                  <th className="text-center border-r p-1">Sarjat</th>
                  <th className="text-center p-1 ">Toistot</th>
                  <th className="text-center border-l p-1">Painot</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center border-r p-1">
                    {addedExercise.exerciseSets}
                  </td>
                  <td className="text-center p-1">
                    {addedExercise.exerciseReps}
                  </td>
                  <td className="text-center border-l p-1">
                    {addedExercise.exerciseWeight}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      <div className="flex flex-col pb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 block">
          Treenin nimi
        </label>
        <input
          className="p-1 bg-gray-50 w-full border border-gray-200 rounded-sm"
          type="text"
          placeholder="esim. Rinta"
          name="workoutName"
        />
      </div>
      <div className="flex flex-col border bg-gray-50 border-gray-200 p-2 rounded-sm shadow-sm">
        <div className="flex justify-between p-2 border-b border-b-gray-400">
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
              Liikkeen nimi
            </p>
          </div>
          <div>
            <select
              name="exerciseName"
              className="text-sm font-semibold bg-transparent text-gray-700 outline-none cursor-pointer hover:text-blue-600 transition-colors "
            >
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-white p-2 border border-gray-200 rounded-sm">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500  block">
              Sarjan tiedot
            </label>
            <div className="flex gap-2 bg-gray-50 border border-gray-200 rounded-sm">
              <select
                name="exerciseSets"
                defaultValue="3"
                className="p-2 bg-gray-50 w-12 border-r border-gray-200  [appearance:textfield]"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
              <p className="flex justify-center flex-col text-xs font-semibold uppercase tracking-wider text-gray-500">
                työsarjaa
              </p>
            </div>
            <div className="flex gap-2 bg-gray-50 border border-gray-200 rounded-sm">
              <input
                type="number"
                name="exerciseReps"
                className="p-2 bg-gray-50 w-12 border-r border-gray-200  [appearance:textfield]"
                placeholder="x"
              />
              <p className="flex justify-center flex-col text-xs font-semibold uppercase tracking-wider text-gray-500">
                toistoja
              </p>
            </div>
            <div className="flex gap-2 bg-gray-50 border border-gray-200 rounded-sm">
              <input
                type="number"
                name="exerciseWeight"
                className="p-2 bg-gray-50 w-12 border-r border-gray-200  [appearance:textfield]"
                placeholder="kg"
              />
              <p className="flex justify-center flex-col text-xs font-semibold uppercase tracking-wider text-gray-500">
                aloituspaino
              </p>
            </div>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="mt-1 p-3 border border-sky-100 bg-sky-600 w-full rounded-md text-white font-bold hover:bg-sky-800 cursor-pointer"
          >
            Lisää liike
          </button>
          <button
            type="button"
            onClick={saveWorkout}
            className="mt-1 p-3 border border-green-100 bg-green-600 w-full rounded-md text-white font-bold hover:bg-green-800 cursor-pointer"
          >
            Aloita treeni
          </button>
        </div>
      </div>
    </form>
  );
}
