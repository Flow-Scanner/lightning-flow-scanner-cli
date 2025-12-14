import { SfCommand, Flags } from "@salesforce/sf-plugins-core";
import { Messages } from "@salesforce/core";
import chalk from "chalk";
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import pkg from "@flow-scanner/lightning-flow-scanner-core";
import { FindFlows } from "../../libs/FindFlows.js";

const { parse: parseFlows, exportDiagram } = pkg;

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages("lightning-flow-scanner", "doc");

export default class Doc extends SfCommand<void> {
  public static readonly summary = messages.getMessage("summary");
  public static readonly description = messages.getMessage("description");

  public static readonly examples = [
    `<%= config.bin %> <%= command.id %>`,
    `<%= config.bin %> <%= command.id %> --output docs/FLOW_DOCUMENTATION.md`,
    `<%= config.bin %> <%= command.id %> --output docs --separate   # ← one file per flow`,
    `<%= config.bin %> <%= command.id %> --raw > diagrams.mmd`,
  ];

  public static readonly flags = {
    directory: Flags.directory({
      char: "d",
      description: messages.getMessage("flags.directory"),
      default: ".",
      exists: true,
    }),
    files: Flags.file({
      char: "f",
      multiple: true,
      exists: true,
      description: messages.getMessage("flags.files"),
      exclusive: ["directory"],
    }),
    output: Flags.directory({
      char: "o",
      description: messages.getMessage("flags.output"),
      default: ".", // current dir if not specified
      exists: false,
    }),
    separate: Flags.boolean({
      char: "s",
      description: messages.getMessage("flags.separate"),
      default: false,
    }),
    "no-details": Flags.boolean({
      description: messages.getMessage("flags.noDetails"),
      default: false,
    }),
    raw: Flags.boolean({
      description: messages.getMessage("flags.raw"),
      default: false,
      exclusive: ["no-details"],
    }),
    collapsed: Flags.boolean({
      description: messages.getMessage("flags.collapsed"),
      default: true,
      allowNo: true,
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Doc);

    const flowPaths = flags.files?.length ? flags.files : FindFlows(flags.directory);

    if (flowPaths.length === 0) {
      this.warn("No flow files found.");
      return;
    }

    this.spinner.start(`Parsing ${flowPaths.length} flow(s)...`);

    const parsedFlows = await parseFlows(flowPaths);
    const validFlows = parsedFlows.filter((p) => p.flow).map((p) => p.flow!);

    if (validFlows.length === 0) {
      this.spinner.stop();
      this.error("No valid flows were parsed.");
    }

    const options = {
      includeDetails: !flags["no-details"] && !flags.raw,
      includeMarkdownDocs: !flags.raw,
      collapsedDetails: flags.collapsed,
    };

    this.spinner.stop();

    if (flags.separate) {
      // === ONE FILE PER FLOW ===
      await mkdir(flags.output, { recursive: true });

      for (const flow of validFlows) {
        // Generate single-flow markdown
        const singleParsed = parsedFlows.filter(p => p.flow?.name === flow.name);
        const singleMd = exportDiagram(singleParsed, {
          ...options,
          includeMarkdownDocs: true, // always include header for individual files
        });

        // Sanitize filename
        const safeName = flow.name.replace(/[^a-zA-Z0-9_-]/g, "_");
        const filePath = join(flags.output, `${safeName}.md`);

        await writeFile(filePath, singleMd);
        this.log(chalk.green(`✓ ${safeName}.md`));
      }

      this.log(chalk.cyan(`\nGenerated ${validFlows.length} individual flow documentation files in: ${flags.output}`));
    } else {
      // === SINGLE COMBINED FILE ===
      const combinedMd = exportDiagram(parsedFlows, options);

      const outputPath = join(flags.output, "FLOW_DOCUMENTATION.md");

      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, combinedMd);

      this.log(chalk.green(`✅ All-in-one documentation written to: ${outputPath}`));
      this.log(chalk.cyan(`\nGenerated documentation for ${validFlows.length} flow(s).`));
    }
  }
}