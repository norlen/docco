import { readdir, stat } from "node:fs/promises";
import path from "node:path";

export type ContentType = "markdown" | "html";

export type Entry = {
  fullPath: string;
  contentType: ContentType;
  content: string;
};

function extensionToContentType(extension?: string): ContentType | undefined {
  switch (extension) {
    case "html":
      return "html";
    case "md":
      return "markdown";
    default:
      return undefined;
  }
}

export async function createEntries(
  dirPath: string,
  extensions: string[],
): Promise<Entry[]> {
  const files = await readdir(dirPath, { recursive: true });
  const entries = files
    .map((relativePath) => {
      const ext = extensions.find((ext) => relativePath.endsWith(ext));
      const contentType = extensionToContentType(ext);
      const fullPath = path.join(dirPath, relativePath);
      return { relativePath, fullPath, contentType };
    })
    .filter(({ contentType }) => !!contentType)
    .filter(async ({ fullPath }) => {
      return (await stat(fullPath)).isFile();
    })
    .map(async ({ relativePath, fullPath, contentType }) => {
      const file = Bun.file(fullPath);
      const content = await file.text();
      return {
        fullPath: relativePath,
        contentType: contentType!,
        content,
      } satisfies Entry;
    });
  return Promise.all(entries);
}
