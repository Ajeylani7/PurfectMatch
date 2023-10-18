"use client";
import React, { useEffect, useState, useRef } from "react";
// Import Axios, a promise-based HTTP client for JavaScript.
// It's used to send asynchronous HTTP requests to REST endpoints.
import axios from "axios";
import { Card, Button, Skeleton } from "@nextui-org/react";
import confetti from "canvas-confetti";
import { Image } from "@nextui-org/react";

// The main functional component for displaying cats.
export default function Cats() {
  // State variable for storing cat data.
  // Initially try to fetch it from localStorage, otherwise set it as an empty array.
  const [cats, setCats] = useState([]);

  // State variable for keeping track of which cats are adopted.
  // Initialize it as an array of 40 elements, all set to 'false' (not adopted).
  const [adopted, setAdopted] = useState(new Array(40).fill(false));

  // useRef to keep track of the 'Adopt' button elements.
  // This will be used to get the button's position for the confetti animation.
  const buttonRef = useRef({});

  // useEffect to run client-side logic.
  // This useEffect will only run once after the initial render.
  useEffect(() => {
    // Try to get the 'cats' data from localStorage.
    const initialCats = localStorage.getItem("cats");
    // If found, update the 'cats' state with the data from localStorage.
    if (initialCats) {
      setCats(JSON.parse(initialCats));
    }
  }, []);
  // Effect for fetching cat data from API
  useEffect(() => {
    const fetchData = async () => {
      // Making an API call to fetch cat data
      const res = await axios.get(
        "https://api.thecatapi.com/v1/images/search?limit=100",
        {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_CAT_API_KEY,
          },
        }
      );
      // Filtering out incomplete cat data and only keeping jpg and png images
      const completeCats = res.data.filter(
        (cat) =>
          cat.breeds.length > 0 &&
          (cat.url.endsWith(".jpg") || cat.url.endsWith(".png"))
      );
      // Merging the new cats with the existing cats in state
      const newCats = [...cats, ...completeCats.slice(0, 40 - cats.length)];
      // Updating the 'cats' state
      setCats(newCats);
      // Storing the new 'cats' state in localStorage for persistence
      localStorage.setItem("cats", JSON.stringify(newCats));
    };
    // Only fetch new data if we have less than 40 cats
    if (cats.length < 40) {
      fetchData();
    }
  }, [cats]);

  // Effect to initialize 'adopted' state whenever 'cats' state changes
  useEffect(() => {
    const adpt = new Array(cats.length).fill(false);
    setAdopted(adpt);
  }, [cats]);

  // Function to handle the adoption of a cat
  const handleAdopt = (index) => {
    // Copying the current 'adopted' state
    const newAdopted = [...adopted];
    // Toggling the adoption status for the selected cat
    newAdopted[index] = !newAdopted[index];
    // Updating the 'adopted' state
    setAdopted(newAdopted);
    // If the cat is adopted, trigger a confetti animation
    if (newAdopted[index]) {
      // Getting the button's position on the screen
      const { left, top, width, height } =
        buttonRef.current[index].getBoundingClientRect();
      // Triggering the confetti animation at the button's position
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          x: (left + width / 2) / window.innerWidth,
          y: (top + height / 2) / window.innerHeight,
        },
      });
    }
  };

  return (
    <div
      className="responsive-grid grid grid-cols-4 gap-8 mt-8 mb-8 rounded-lg shadow-lg"
      style={{ maxWidth: "1700px", padding: "20px" }}
      isBlurred
    >
      {cats.map((cat, index) => (
        <Card
          key={cat.id}
          className="space-y-5 p-4 relative flex flex-col"
          radius="lg"
          color="#f3f4f6"
        >
          <div className="mb-auto">
            <Image
              isBlurred
              src={cat.url}
              alt="Cat"
              classNames="m-5"
              style={{ width: "400px", height: "300px", objectFit: "cover" }}
            />
          </div>
          <div className="space-y-3 text-center">
            <div className="text-xl font-semibold">
              {cat.breeds[0]?.name || "Unknown"}
            </div>
            <div className="text-sm text-gray-600">
              {cat.breeds[0]?.origin || "Unknown"}
            </div>
            <div className="text-sm text-gray-600">
              Life Span: {cat.breeds[0]?.life_span || "Unknown"}
            </div>
            <div className="text-sm text-gray-600">
              {cat.breeds[0]?.temperament || "Unknown"}
            </div>
          </div>
          <Button
            auto
            size="tiny"
            className={adopted[index] ? "bg-secondary-button w-full" : "w-full"}
            ref={(el) => (buttonRef.current[index] = el)}
            onClick={() => handleAdopt(index)}
          >
            Adopt
          </Button>
        </Card>
      ))}
      {Array.from({ length: 40 - cats.length }, (_, index) => (
        <Card
          key={index + cats.length}
          className="space-y-5 p-4 relative flex flex-col"
          radius="lg"
          color="#F3F4F6"
        >
          <Skeleton className="mb-auto h-[300px] w-[300px] rounded-lg"></Skeleton>
          <Skeleton className="w-3/5 rounded-lg h-3"></Skeleton>
          <Skeleton className="w-4/5 rounded-lg h-3"></Skeleton>
          <Skeleton className="w-2/5 rounded-lg h-3"></Skeleton>
        </Card>
      ))}
    </div>
  );
}
