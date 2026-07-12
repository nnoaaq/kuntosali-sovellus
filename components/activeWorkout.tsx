interface workoutTemplate {
  id: number;
  userId: number;
  name: string;
  WorkoutTemplateExercises: {
    id: number;
    exerciseId: number;
    Exercises: { name: string; id: number };
    workoutTemplateId: number;
    WorkoutTemplateSets: {
      id: number;
      reps: number;
      weight: number;
      workoutTemplateExerciseId: number;
    }[];
  }[];
}
export function ActiveWorkout({
  workoutTemplateData,
}: {
  workoutTemplateData: workoutTemplate;
}) {
  console.log(workoutTemplateData);
  return (
    <div className="flex flex-col gap-3 p-2 border max-w-md w-full mx-auto border-stone-400 rounded-sm shadow-md bg-stone-100">
      <div>{workoutTemplateData.name}</div>
      {workoutTemplateData.WorkoutTemplateExercises.map((exercise) => (
        <div
          key={exercise.id}
          className="border border-stone-300 bg-white p-1 rounded-sm shadow"
        >
          <div>
            <p className="pb-1.5">{exercise.Exercises.name}</p>
          </div>
          <div className="flex flex-col gap-2">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-gray-400 uppercase text-xs text-center py-2 font-semibold w-12">
                    sarja
                  </th>
                  <th className="text-gray-400 uppercase text-xs text-center py-2 font-semibold">
                    toistot
                  </th>
                  <th className="w-6"></th>
                  <th className="text-gray-400 uppercase text-xs text-center py-2 font-semibold">
                    painot
                  </th>
                  <th className="text-left w-10"></th>
                </tr>
              </thead>
              <tbody>
                {exercise.WorkoutTemplateSets.map((set, index) => (
                  <tr
                    key={set.id}
                    className="border-b border-stone-100 last:border-none"
                  >
                    <td className="text-center py-2.5 text-sm font-medium text-stone-500">
                      {index + 1}
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
      ))}
    </div>
  );
}
