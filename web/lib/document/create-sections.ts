import type { Root, RootContent } from "hast";
import { toString } from "hast-util-to-string";
import slugify from "slugify";

function normalizeContent(content: string): string {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n\n");
}

const EXTRACT_TEXT_FROM_TAGS = [
  "pre",
  "ul",
  "ol",
  "li",
  "p",
  "div",
  "span",
  "strong",
  "em",
];

function shouldExtractTextFromNode(node: RootContent): boolean {
  return (
    node.type === "text" ||
    (node.type === "element" && EXTRACT_TEXT_FROM_TAGS.includes(node.tagName))
  );
}

/**
 * Extracts text from a node.
 *
 * This function handles different types of nodes and their children. It skips certain tags and formats others (like <pre>, <ul>, and <ol>).
 *
 * Handles the following cases:
 * - Formats <pre> tags with code blocks
 * - Formats <ul> and <ol> tags with list items
 * - Recursively processes child nodes for other tags
 *
 * @param node - The node to extract text from.
 * @returns The extracted text.
 */
function extractTextFromNode(node: RootContent): string {
  if (node.type === "text") return node.value;

  if (node.type !== "element") {
    return "";
  }

  switch (node.tagName) {
    case "pre": {
      return "```\n" + toString(node) + "\n```";
    }
    case "ul": {
      return node.children
        .map((child) =>
          child.type === "element" && child.tagName === "li"
            ? `- ${toString(child)}`
            : "",
        )
        .join("\n");
    }
    case "ol": {
      let i = 1;
      return node.children
        .map((child) =>
          child.type === "element" && child.tagName === "li"
            ? `${i++}. ${toString(child)}`
            : "",
        )
        .join("\n");
    }
    default: {
      return (node.children || []).map(extractTextFromNode).join("\n");
    }
  }
}

type StackItem = {
  id: string;
  path: string[];
  heading: string;
  level: number;
  content: string[];
  nestingLevel: number;
};

export type Section = {
  id: string;
  path: string[];
  heading: string;
  level: number;
  content: string;
};

export function extractSections(tree: Root): Section[] {
  const sections: Section[] = [];
  const stack: StackItem[] = [];

  const currentStack = () => stack[stack.length - 1];
  const getPath = () => stack.map((s) => s.heading);

  const addSection = (stack: StackItem) => {
    sections.push({
      id: stack.id,
      path: stack.path,
      heading: stack.heading,
      level: stack.level,
      content: normalizeContent(stack.content.join("\n\n")),
    });
  };

  const flushStackToLevel = (level: number) => {
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      addSection(stack.pop()!);
    }
  };

  const flushStackToNesting = (nesting: number) => {
    while (stack.length > 0 && stack[stack.length - 1].nestingLevel > nesting) {
      addSection(stack.pop()!);
    }
  };

  const handleNode = (node: RootContent, nestingLevel: number) => {
    // Text node: add to the current section if it exists.
    if (shouldExtractTextFromNode(node)) {
      const section = currentStack();
      const extractedText = extractTextFromNode(node).trim();
      if (section && extractedText.length > 0) {
        section.content.push(extractedText);
      }
      return;
    }
    // if (node.type === "text") {
    //   const section = currentStack();
    //   const nodeValue = node.value.trim();
    //   if (section && nodeValue.length > 0) {
    //     section.content.push(nodeValue);
    //   }
    //   return;
    // }

    if (node.type === "element") {
      const tag = node.tagName;
      if (/^h[1-6]$/.test(tag)) {
        const level = parseInt(tag[1]);
        const headingText = toString(node).trim();
        const slug = slugify(headingText, {
          lower: true,
          strict: true,
        });

        flushStackToLevel(level);
        stack.push({
          id: slug,
          path: getPath(),
          heading: headingText,
          level,
          content: [],
          nestingLevel,
        });
      } else if (!["nav", "footer", "script", "style"].includes(tag)) {
        for (const child of node.children || []) {
          handleNode(child, nestingLevel + 1);
        }
      }
    }

    flushStackToNesting(nestingLevel);
  };

  for (const node of tree.children) {
    handleNode(node, 0);
  }

  // Flush any remaining sections in the stack
  flushStackToLevel(0);

  return sections;
}
