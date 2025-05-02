import { sql } from "drizzle-orm";
import { index, sqliteTableCreator } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `${name}`);

export type Navigation = NavigationItem[];

export type NavigationItem = {
  contentId?: string;
  title: string;
  url?: string;
  items?: NavigationItem[];
};

export const navigation = createTable("navigation", (d) => ({
  id: d.text().notNull().primaryKey(),
  content: d.text().notNull(),
  createdAt: d
    .integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
}));

export type Page = {
  id: string;
  slug: string;
  url: string;
  fullPath: string;
  title: string;
  content: string;
};

export const pages = createTable(
  "pages",
  (d) => ({
    id: d.text().notNull().primaryKey(),
    slug: d.text().notNull(),
    url: d.text().notNull(),
    fullPath: d.text().notNull().unique(),
    title: d.text().notNull(),
    content: d.text().notNull(),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
  }),
  (t) => [index("pages_slug_idx").on(t.slug)],
);
