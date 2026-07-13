"use client";
interface Workout {
  id: number;
  name: string;
  exercises: {
    id: number;
    sets: { id: number; reps: number; order: number; weight: number }[];
  }[];
}
export function ActiveWorkout({ workout }: { workout: Workout }) {
  if (!workout) return "ei workouttia";
  return <div className="border w-100 border-gray-400 p-2 rounded"></div>;
}
