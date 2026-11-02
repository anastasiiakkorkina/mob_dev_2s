import { useEffect, useState } from "react";

// This page makes timer setup, cancellation, and missing cleanup easy to observe.
export default function CleanupDemo() {
  // Changing the delay changes an effect dependency and starts a new timer.
  const [delayMs, setDelayMs] = useState(5000);
  // The checkbox lets the learner compare safe and intentionally unsafe behavior.
  const [cleanupEnabled, setCleanupEnabled] = useState(true);

  useEffect(() => {
    // Each setup owns one timeout and records which delay it captured.
    console.log(`Timer effect setup: ${delayMs} ms; cleanup ${cleanupEnabled ? "on" : "off"}`);
    const timeoutId = window.setTimeout(() => {
      // This log still appears after unmount if the timeout was not cleared.
      console.log(`Timer fired: delay captured by this setup was ${delayMs} ms`);
    }, delayMs);

    // Return no cleanup only for the deliberate comparison mode.
    if (!cleanupEnabled) {
      console.log("Cleanup is off: this timeout will remain scheduled.");
      return;
    }

    // React calls this before the next setup and when this page unmounts.
    return () => {
      window.clearTimeout(timeoutId);
      console.log(`Timer cleanup: cancelled the ${delayMs} ms timeout`);
    };
  }, [delayMs, cleanupEnabled]);

  return (
    <section aria-labelledby="cleanup-demo-title">
      <h2 id="cleanup-demo-title">Timer cleanup demonstration</h2>
      <p>Open the browser console. Change the delay or leave this route before the timer fires.</p>
      <p>Current delay: {delayMs} ms</p>
      <button
        type="button"
        onClick={() => setDelayMs((current) => (current === 5000 ? 1000 : 5000))}
      >
        Change delay and restart timer
      </button>
      <label>
        <input
          type="checkbox"
          checked={cleanupEnabled}
          onChange={(event) => setCleanupEnabled(event.target.checked)}
        />
        Enable timeout cleanup
      </label>
      <p>
        Turn cleanup off to see an old timeout still fire after a dependency change or after you
        leave this page.
      </p>
    </section>
  );
}
