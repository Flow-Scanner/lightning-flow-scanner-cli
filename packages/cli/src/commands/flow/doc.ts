import { SfCommand, Flags } from "@salesforce/sf-plugins-core";
import { Messages } from "@salesforce/core";
import chalk from "chalk";
import pkg from "@flow-scanner/lightning-flow-scanner-core";
import { FindFlows } from "../../libs/FindFlows.js";

const { parse: parseFlows, exportDiagram } = pkg;

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages("lightning-flow-scanner", "doc");

export default class Doc extends SfCommand<string> {
  public static readonly summary = messages.getMessage("summary");
  public static readonly description = messages.getMessage("description");

  public static readonly examples = [
    `<%= config.bin %> <%= command.id %>`,
    `<%= config.bin %> <%= command.id %> -d flows`,
    `<%= config.bin %> <%= command.id %> --files MyFlow.flow-meta.xml`,
    `<%= config.bin %> <%= command.id %> --output docs/FLOW_DOCUMENTATION.md`,
    `<%= config.bin %> <%= command.id %> --no-details --raw > diagram.mmd`,
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
    output: Flags.file({
      char: "o",
      description: messages.getMessage("flags.output"),
      helpValue: "path/to/file.md",
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

  public async run(): Promise<string> {
    const { flags } = await this.parse(Doc);

    const flowPaths = flags.files?.length
      ? flags.files
      : FindFlows(flags.directory);

    if (flowPaths.length === 0) {
      this.warn("No flow files found.");
      return "";
    }

    this.spinner.start(`Parsing ${flowPaths.length} flow(s)...`);

    const parsedFlows = await parseFlows(flowPaths);
    const validFlows = parsedFlows.filter((p) => p.flow);

    if (validFlows.length === 0) {
      this.spinner.stop();
      this.error("No valid flows were parsed.");
    }

    const options = {
      includeDetails: !flags["no-details"] && !flags.raw,
      includeMarkdownDocs: !flags.raw,
      collapsedDetails: flags.collapsed,
    };

    const markdown = exportDiagram(parsedFlows, options);

    this.spinner.stop();

    if (flags.output) {
      const fs = await import("fs/promises");
      await fs.writeFile(flags.output, markdown);
      this.log(chalk.green(`✅ Documentation written to: ${flags.output}`));
    } else {
      this.log(markdown);
    }

    this.log(chalk.cyan(`\nGenerated documentation for ${validFlows.length} flow(s).`));

    return markdown;
  }
}