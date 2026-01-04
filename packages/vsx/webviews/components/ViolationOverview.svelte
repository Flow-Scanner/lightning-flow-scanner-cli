<script lang="ts">
  import { onMount } from "svelte";
  import NavigationBanner from "./Navigation.svelte";
  import ViolationTableFull from "./ViolationTableFull.svelte";

  let results;
  let scanResults;
  let allResults;

  onMount(() => {
    tsvscode.postMessage({ type: "init-view" });
  });

  let banner;

  $: {
    let details = [];
    if (scanResults) {
      for (let scanResult of scanResults) {
        for (let ruleResult of scanResult.ruleResults) {
          let ruleDescription = ruleResult.message || ruleResult.ruleDefinition.description;
          let ruleLabel = ruleResult.ruleDefinition.label;
          let ruleId = ruleResult.ruleId;
          let ruleUrl = ruleResult.messageUrl || "";
          let flowName = scanResult.flow.name;
          let flowPath = scanResult.flow.path || scanResult.flow.fsPath || scanResult.flow.uri;
          let severity = ruleResult.severity ?? "warning";

          let initobj = { ruleDescription, ruleLabel, ruleId, ruleUrl, flowName, flowPath, severity };

          if (ruleResult.occurs) {
            for (let detail of ruleResult.details) {
              let name = detail.name || "";
              let type = detail.type || "";
              let metaType = detail.metaType || "";
              let dataType = detail.details?.dataType || "";
              let lineNumber = detail.lineNumber || "";
              let columnNumber = detail.columnNumber || "";
              let connectsTo = detail.details?.connectsTo?.join() || "";
              let expression = detail.details?.expression || "";

              details.push(Object.assign(structuredClone(initobj), {
                name, type, metaType, dataType,
                lineNumber, columnNumber, connectsTo, expression
              }));
            }
          }
        }
      }
    }
    allResults = details;
  }

  function windowMessage(event: MessageEvent) {
    const message = event.data;
    switch (message.type) {
      case "init":
        const state = tsvscode.getState();
        scanResults = state?.value ?? message.value;
        break;
      case "update":
        scanResults = message.value;
        tsvscode.setState({ scanResults });
        break;
    }
  }
</script>

<svelte:window on:message={windowMessage} />

<NavigationBanner
  currentPage="viewAll"
  showDownload
  bind:this={banner}
  on:navigate={(e) => banner.navigate(e, scanResults)}
  on:download={() => results?.download()}
/>

{#if allResults?.length}
  <ViolationTableFull bind:this={results} bind:allResults />
{/if}