import superjson from "superjson";

const SERVER_URL = "http://localhost:3000/api/content";

type ContentItem = {
  fullPath: string;
  content: string;
};

export async function createContent(content: ContentItem[]) {
  const serializedInput = superjson.serialize(content).json;

  const res = await fetch(SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serializedInput),
  });

  if (!res.ok) {
    throw new Error(`Call to create content failed with status ${res.status}`);
  }
}
