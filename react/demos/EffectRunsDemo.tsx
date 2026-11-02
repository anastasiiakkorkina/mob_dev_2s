import { useEffect, useState } from "react";

// This small page makes dependency behavior easy to trigger and inspect.
export default function EffectRunsDemo() {
  // Clicking the button changes this value and causes a new render.
  const [count, setCount] = useState(0);

  // Empty dependencies: setup runs on mount, not for later count changes.
  useEffect(() => {
    console.log("Effect with []: mount setup");
  }, []);

  // A populated array: React checks count and runs again when it changes.
  useEffect(() => {
    console.log("Effect with [count]:", count);
  }, [count]);

  // No array: this setup runs after every committed render.
  useEffect(() => {
    console.log("Effect with no dependency array");
  });

  return (
    <section aria-labelledby="effect-demo-title">
      <h2 id="effect-demo-title">Effect timing demonstration</h2>
      <p>Open the browser console, then change the count to compare the three effects.</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Render again
      </button>
    </section>
  );
}
