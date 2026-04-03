import fs from "fs";

try {
  const envFile = fs.readFileSync(".env", "utf-8");
  const match = envFile.match(/VITE_GEMINI_KEY=(.+)/);
  if (match) {
    const key = match[1].trim();
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();
    console.log(JSON.stringify(data.models.map(m => m.name), null, 2));
  } else {
    console.log("No key found");
  }
} catch (e) {
  console.error(e);
}
