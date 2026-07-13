# Kuntosali - sovellus

## Tarkoitus harjoitella FullStack - sovelluksen kehitystä

### Näillä tarkoitus tehdä

- Next.js
- TailwindCSS
- TypeScript
- Supabase
- PostgreSQL

```dbml
Table Users {
  id integer [pk, increment]
  email text [unique]
  passwordHash text
}
Table Exercises {
  id integer [pk, increment]
  name text [unique]
}
Table WorkoutTemplates {
  id integer [pk, increment]
  name text
}
Table WorkoutTemplateExercises {
  id integer [pk, increment]
  exerciseId integer [ref: > Exercises.id]
  workoutTemplateId integer [ref : > WorkoutTemplates.id]
}
Table WorkoutTemplateSets {
  id integer [pk, increment]
  reps integer
  weight integer
  workoutTemplateExerciseId integer [ref: > WorkoutTemplateExercises.id]
}
Table Workouts {
  id integer [pk, increment]
  name text
  startTime timestamp [default: `now()`]
  endTime timestamp
  userId integer [ref : > Users.id]
  workoutTemplateId integer [ref: > WorkoutTemplates.id]
}
Table WorkoutExercises {
  id integer [pk, increment]
  exerciseId integer [ref : > Exercises.id]
  workoutId integer [ref : > Workouts.id]
}
Table WorkoutSets {
  id integer [pk, increment]
  reps integer
  weight integer
  order integer
  workoutExerciseId integer [ref : > WorkoutExercises.id]
}
```
