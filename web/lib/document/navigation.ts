import type { NavigationItem } from "@/server/db/schema";
import type { Document } from "./index";

export type NavigationRecord = {
  title: string;
  contentId?: string;
  url?: string;
  items: Record<string, NavigationRecord>;
};

export function titleFromSlug(slug: string): string {
  const cleaned = slug.replace(/[-_/]+/g, " ");
  return cleaned
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function createNavigation(content: Document[]): NavigationItem[] {
  const convertRecordToNavigationItems = (
    items: Record<string, NavigationRecord>,
  ): NavigationItem[] | undefined => {
    if (Object.keys(items).length === 0) {
      return undefined;
    }

    return Object.keys(items)
      .map((key) => {
        const value = items[key];
        return {
          contentId: value.contentId,
          title: value.title,
          url: value.url,
          items: convertRecordToNavigationItems(value.items),
        } satisfies NavigationItem;
      })
      .sort((lhs, rhs) => lhs.title.localeCompare(rhs.title));
  };

  const records = createNavigationRecords(content);
  const navigationItems = convertRecordToNavigationItems(records);
  if (!navigationItems) {
    throw new Error("No navigation items found");
  }
  return navigationItems;
}

function createNavigationRecords(
  content: Document[],
): Record<string, NavigationRecord> {
  const items: Record<string, NavigationRecord> = {};

  const findNode = (slugs: string[]): Record<string, NavigationRecord> => {
    let current = items;
    for (let i = 0; i < slugs.length - 1; ++i) {
      if (!current[slugs[i]]) {
        current[slugs[i]] = {
          title: titleFromSlug(slugs[i]),
          url: undefined,
          items: {},
        };
      }
      current = current[slugs[i]].items;
    }
    return current;
  };

  content.forEach((item) => {
    const record = findNode(item.slugs);
    if (record[item.slug]?.contentId) {
      throw new Error("duplicate page encountered");
    }

    const node = {
      contentId: item.id,
      title: item.title,
      url: item.url,
      items: record[item.slug] ? record[item.slug].items : {},
    } satisfies NavigationRecord;
    record[item.slug] = node;
  });

  return items;
}
