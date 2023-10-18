"use client"; // Indicate that this component should be rendered client-side
import Cats from "./components/Cats"; // Import the Cats component

// Main functional component for the home page
export default function Home() {
  return (
    <main>
      <Cats />
    </main>
  );
}
