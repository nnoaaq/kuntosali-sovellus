# Kuntosali - sovellus

## Tarkoitus harjoitella FullStack - sovelluksen kehitystä

### Näillä tarkoitus tehdä

- Next.js
- TailwindCSS
- TypeScript
- Supabase
- PostgreSQL

```dbml
Table "Users" {
  "id" INTEGER [pk, increment]
  "email" text [unique]
  "password_hash" text
}

// AKTIIVISET TREENIT
Table "Workouts" {
  "id" INTEGER [pk, increment]
  "userId" integer
  "startTime" timestamp [default: 'now()']
  "endTime" timestamp
  "name" text
}

Table "Exercises" {
  "id" INTEGER [pk, increment]
  "name" text
}

Table "WorkoutLog" {
  "id" INTEGER [pk, increment]
  "workoutId" integer
  "exerciseId" integer
}

Table "Sets" {
  "id" INTEGER [pk, increment]
  "weight" decimal
  "reps" integer
  "workoutLogId" integer
}

// TREENIPOHJAT (TEMPLATES)
Table "WorkoutTemplates" {
  "id" integer [pk, increment]
  "userId" integer
  "name" text
}

Table "WorkoutTemplateExercises" {
  "id" integer [pk, increment]
  "workoutTemplateId" integer
  "exerciseId" integer
}

Table "WorkoutTemplateSets" {
  "id" integer [pk, increment]
  "workoutTemplateExerciseId" integer
  "reps" integer
  "weight" decimal // Muutettu integer -> decimal, jos haluaa esim. 2.5 kg painot
}

// YHTEYDET (REFS)
Ref: "Users"."id" < "Workouts"."userId"
Ref: "Workouts"."id" < "WorkoutLog"."workoutId"
Ref: "Exercises"."id" < "WorkoutLog"."exerciseId"
Ref: "WorkoutLog"."id" < "Sets"."workoutLogId"

Ref: "Users"."id" < "WorkoutTemplates"."userId"
Ref: "WorkoutTemplates"."id" < "WorkoutTemplateExercises"."workoutTemplateId"
Ref: "Exercises"."id" < "WorkoutTemplateExercises"."exerciseId"
Ref: "WorkoutTemplateExercises"."id" < "WorkoutTemplateSets"."workoutTemplateExerciseId"
```
