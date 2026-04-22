import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

// This is the main entry point for Deno Deploy
await start(manifest);
