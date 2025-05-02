import type { ElementContent, Root, RootContent } from "hast";

export function find(
  tree: Root | RootContent | ElementContent,
  predicate: (node: Root | RootContent | ElementContent) => boolean,
): Root | RootContent | ElementContent | undefined {
  if (predicate(tree)) {
    return tree;
  }

  if (tree.type === "element" || tree.type === "root") {
    for (const node of tree.children) {
      const found = find(node, predicate);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

export function isHeading(root: Root | RootContent | ElementContent): boolean {
  return root.type === "element" && /^h[1-6]$/.test(root.tagName);
}
