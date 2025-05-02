#!/usr/bin/env bun
import { Command } from "commander";
import { createContent } from "./src/client";
import { createEntries } from "./src/entry";

const program = new Command();

program
  .command("content:create")
  .description("Create content from a file or a list of files")
  .argument("<directory>", "directory containing html files")
  .action(async (directory: string) => {
    try {
      const entries = await createEntries(directory, ["html"]);
      if (entries.length === 0) {
        console.log("No HTML files found in the directory.");
        return;
      }

      console.log("Creating content...");
      await createContent(entries);
      console.log("✅ Content successfully created!");
    } catch (error) {
      console.error("❌ Error while creating content:", error);
    }
  });

program.parse(process.argv);
