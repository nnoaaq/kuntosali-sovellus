import { Footer } from "@/components/footer";
import { WorkoutList } from "@/components/workoutList";
export default async function Home() {
  return (
    <div className="">
      <WorkoutList />
      <Footer />
    </div>
  );
}
