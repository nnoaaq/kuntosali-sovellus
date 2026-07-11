"use client";
import { formatTime } from "@/utils/time";
import { useState } from "react";
import { json } from "stream/consumers";
interface workoutType {
  id: number;
  userId: number;
  startTime: string;
  endTime: string | null;
  name: string;
  workoutLogs: {
    id: number;
    workoutId: number;
    exerciseId: number;
    sets: {
      id: number;
      weight: number;
      reps: number;
      workoutLogId: number;
    }[];
    exercises: {
      name: string;
    };
  }[];
}
export function WorkoutCard({ workout }: { workout: workoutType }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border shadow-lg rounded-md p-2">
      <div
        key={workout.id}
        className="flex justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <p className="font-semibold">{workout.name}</p>
          <p className="font-light">{formatTime(workout.startTime)}</p>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`size-6 transition-transform duration-250 ${isOpen ? "rotate-180" : "rotate-0"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </div>
      {isOpen && (
        <>
          {workout.workoutLogs.map((workoutLog) => (
            <div key={workoutLog.id}>
              <p>{workoutLog.exercises.name}</p>
              <div className="flex gap-2">
                {workoutLog.sets.map((workoutSet) => (
                  <div
                    key={workoutSet.id}
                    className="border border-yellow-400 flex gap-2 rounded shadow p-1 bg-yellow-200"
                  >
                    <p>{workoutSet.reps} x</p>
                    <p>{workoutSet.weight} kg</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
