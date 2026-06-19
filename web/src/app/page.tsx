import { HomeSeam } from "@/components/home/HomeSeam";

// The live homepage — "The Seam", the client-approved synthesis of the 06-12
// review favorites. Metadata (title / description / OpenGraph) is inherited from
// the indexable defaults in layout.tsx. The composition lives in HomeSeam so the
// /home-seam draft route can render the exact same thing for side-by-side review.
export default function HomePage() {
  return <HomeSeam />;
}
