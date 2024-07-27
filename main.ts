import { Hono } from "hono";

import { ipGernerate } from "./ip.ts";

const app = new Hono();

app.get("/jp", (c) => {
  const range = randomeChoice(jpRanges);
  return c.json({
    ip: ipGernerate(range),
    range,
  });
});

app.get("/range/:ranges", (c) => {
  const { ranges } = c.req.param();
  const range = randomeChoice(ranges.replaceAll("_", "/").split("|"));
  try {
    return c.json({
      ip: ipGernerate(range),
      range,
    });
  } catch (error) {
    return c.text(error, 500);
  }
});

const randomeChoice = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)]!;
};

const getRanges = async (f: string): Promise<string[]> => {
  const text = await Deno.readTextFile(f);
  return text.split("\n").filter((l) => l.match(/^\d.+\d$/));
};

const jpRanges = await getRanges("./data/jp.txt");

if (import.meta.main) {
  Deno.serve({
    hostname: "0.0.0.0",
    port: parseInt(Deno.env.get("PORT") ?? "8080"),
  }, app.fetch);
}
