## Instructions for Using NPM Link and Testing the Core Module

### Using NPM Link

By using `npm link`, you can make use of your locally compiled Node Modules. This is especially useful for testing changes in the Lightning Flow Scanner core module without needing to publish a new version. Here are the steps to do this:

#### Linking Core Module

1. **Clone the Core Module**: Ensure you have cloned the `lightning-flow-scanner-core` repository locally.
2. **Link the Core Module**: Navigate to the core module's directory and run the following command:
   ```bash
   npm link
   ```
3. **Link to Project**: Navigate to the VS Code extension or SFDX plugin directory and run:

   ```bash
   npm link lightning-flow-scanner-core
   ```

   Once linked, your local version will be updated in the VS Code extension or SFDX plugin every time you run a new build.

### Testing VS Code Plugin

1. **Compile the Project**: Run the following command to verify compilation:

   ```bash
   npm run watch
   ```

   Alternatively, you can use:

   ```bash
   npm run prepack
   ```

2. **Launch Application**: After compiling, launch the application to test your changes.

### Testing SFDX Plugin

1. **Compile the Project**: Run the following command to verify compilation:

   ```bash
   npm run prepack
   ```

2. **Open Example Project**: Open the terminal and run the following command in the directory of an example flow project (or any other project that is supposed to be scanned):

   ```bash
   NODE_OPTIONS=--inspect-brk /Users/rubenhalman/Projects/lightning-flow-scanner-sfdx/bin/run flow:scan
   ```

3. **Attach Debugger**: Go back to your local SFDX project in VS Code, set your desired breakpoints, and attach the debugger to the remote process.

### Publishing

Once you have tested your changes, you can publish the new package version by running:

```bash
npm publish
```
