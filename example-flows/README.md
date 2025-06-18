# ⚡️ Lightning Flow Scanner Demo Flows

Welcome to the **Lightning Flow Scanner Demo Flows**! This project includes a curated set of Salesforce Flow metadata files (`.flow-meta.xml`) intended for:

- ✅ Demonstrating best practices and violations detectable by [Lightning Flow Scanner](https://github.com/Lightning-Flow-Scanner)
- 🧪 Serving as a reliable input set for automated testing in the main scanner repository
- 🚀 Easy deployment to any org using the Salesforce CLI

These flows are designed to support testing, demoing, and local development without maintaining a separate demo repository.

---

## 🔧 Usage

You can deploy the demo flows using:

```bash
npm run deploy:testflows -- --target-org my-sandbox
```

Or with an environment variable:

```bash
SF_TARGET_ORG=my-sandbox npm run deploy:testflows
```

---

## 📁 Project Structure

This is a standard Salesforce DX project structure:

```
example-flows/
└── force-app/
    └── main/
        └── default/
            └── flows/
                ├── Copy_API_Name.flow-meta.xml
                ├── Hardcoded_Id.flow-meta.xml
                ├── ...
```

---

## 🧪 Connected to Unit Tests

These flows are directly referenced by unit tests in the main [`lightning-flow-scanner-core`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core) repository. Tests point to:

```
../example-flows/force-app/main/default/flows/
```

No more maintaining a separate flows repo! 🎉

---

## 💡 Want to Explore in VS Code?

1. **Clone this repo**
   - `git clone https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core.git`
2. **Open `example-flows/` in VS Code**
3. **Install recommended extensions when prompted**
4. Use Salesforce CLI or the Lightning Flow Scanner VS Code extension to scan and analyze the flows.

---

## 🧩 Recommended VS Code Extensions

- [Lightning Flow Scanner Extension](https://marketplace.visualstudio.com/items?itemName=ForceConfigControl.lightningflowscanner)

## 📖 Resources

- [Lightning Flow Scanner Core](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core)
- [Lightning Flow Scanner VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ForceConfigControl.lightningflowscanner)
- [Salesforce DX Documentation](https://developer.salesforce.com/tools/sfdxcli)

---

Happy Flow Scanning! 🚦✨
