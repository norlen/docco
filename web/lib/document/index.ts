import type { Root } from "hast";
import { toString } from "hast-util-to-string";
import { nanoid } from "nanoid";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import slugify from "slugify";
import { unified } from "unified";
import { extractSections, type Section } from "./create-sections";
import { find, isHeading } from "./util";

export type Document = {
  id: string;
  fullPath: string;
  url: string;
  title: string;
  slug: string;
  slugs: string[];
  sections: SectionWithUrl[];
  content: string;
};

export type SectionWithUrl = Section & {
  url: string;
};

export function processDocument(
  fullPath: string,
  htmlContent: string,
): Document {
  if (!fullPath) {
    throw new Error("Full path is required for document");
  }
  if (!htmlContent) {
    throw new Error("HTML content is required for document");
  }

  const tree = processHtml(htmlContent);
  const slugs = fullPath
    .split("/")
    .map((p) => removeFileExtension(p))
    .map((p) => slugify(p, { lower: true, strict: true }));

  const title = getTitle(tree, slugs);
  const slug = slugify(title, { lower: true, strict: true });
  const url = generateUrl(slugs);

  const sections: SectionWithUrl[] = extractSections(tree).map((section) => ({
    ...section,
    url,
  }));
  const content = generateHtml(tree);

  return {
    id: nanoid(),
    fullPath,
    url,
    title,
    slug,
    slugs,
    sections,
    content,
  };
}

function processHtml(html: string): Root {
  const tree = unified().use(rehypeParse, { fragment: true }).parse(html);
  return tree;
}

function generateHtml(tree: Root): string {
  const html = unified().use(rehypeStringify).stringify(tree);
  return html;
}

function removeFileExtension(fileName: string): string {
  return fileName.replace(/\.[^/.]+$/, "");
}

function getTitle(tree: Root, slugs: string[]): string {
  const titleNode = find(tree, (node) => isHeading(node));
  const titleFromNode = titleNode ? toString(titleNode).trim() : undefined;
  console.log("getTitle", tree, titleNode, titleFromNode);
  return titleFromNode ?? slugs[slugs.length - 1];
}

function generateUrl(slugs: string[]): string {
  return `/${slugs.join("/")}`;
}
