const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function checkExercise(code: string, expectedOutput: string) {
  const res = await fetch(`${API_URL}/api/check-exercise`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, expected_output: expectedOutput }),
  });
  return res.json();
}