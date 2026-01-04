<script lang="ts">
  import { TabulatorFull as Tabulator } from "tabulator-tables";
  import { onMount } from "svelte";

  export let allResults: any[] = [];
  let tableComponent: HTMLDivElement;
  let table: Tabulator;
  let printData: any[] = [];
  let originalData: any[] = []; // Keep original

  // Update when allResults changes
  $: if (allResults) {
    originalData = allResults.map(r => ({ ...r }));
    printData = originalData;
    if (table) table.setData(originalData);
  }

  onMount(() => {
    table = new Tabulator(tableComponent, {
      data: [],
      reactiveData: false,
      layout: "fitColumns",
      groupBy: ["ruleId"],
      groupHeader: (value, count, data) => {
        const label = data[0]?.ruleLabel || "";
        const desc = data[0]?.ruleDescription || "";
        const url = data[0]?.ruleUrl || "";
        const descHtml = url
          ? `<a href="${url}" target="_blank" style="color: #4a9eff; text-decoration: underline;">${desc}</a>`
          : desc;
        return `<strong>${label}</strong> <span style="color: #888;">(${value})</span> <span>(${count})</span><p style="font-style:italic;white-space:normal;word-wrap:break-word;max-width:100%;">${descHtml}</p>`;
      },
      columns: [
        { title: "#", formatter: "rownum", width: 75 },
        { 
          title: "Name", field: "name", minWidth: 150,
          headerFilter: "input", headerFilterFunc: "like", headerFilterPlaceholder: ""
        },
        { 
          title: "Severity", field: "severity", minWidth: 150,
          headerFilter: "input", headerFilterFunc: "like", headerFilterPlaceholder: ""
        },
        { 
          title: "Type", field: "type", width: 150,
          headerFilter: "input", headerFilterFunc: "like", headerFilterPlaceholder: ""
        },
        {
          title: "Flow name", field: "flowName", minWidth: 150,
          headerFilter: "input", headerFilterFunc: "like", headerFilterPlaceholder: "",
          formatter: "link",
          formatterParams: (cell: any) => ({
            label: cell.getValue(),
            url: "javascript:void(0);",
          }),
          cellClick: (_e: any, cell: any) => {
            const rowData = cell.getRow().getData();
            if (rowData.flowPath) {
              tsvscode.postMessage({
                type: "goToFile",
                value: { path: rowData.flowPath },
              });
            }
          },
        },
        { title: "Line", field: "lineNumber", width: 75, headerFilter: "input", headerFilterFunc: "like", headerFilterPlaceholder: "" },
        { title: "Column", field: "columnNumber", width: 85, headerFilter: "input", headerFilterFunc: "like", headerFilterPlaceholder: "" },
        { title: "Connects to", field: "connectsTo", minWidth: 150, headerFilter: "input", headerFilterFunc: "like", headerFilterPlaceholder: "" },
        { title: "Expression", field: "expression", minWidth: 150, headerFilter: "input", headerFilterFunc: "like", headerFilterPlaceholder: "" },
        { title: "DataType", field: "dataType", width: 150, headerFilter: "input", headerFilterFunc: "like", headerFilterPlaceholder: "" },
      ],
    });
  });

  export function download() {
    tsvscode.postMessage({ type: "download", value: printData });
  }

  function onMessage(e: MessageEvent) {
    const msg = e.data;

    if (msg.type === "applySearchFlowName") {
      const term = (msg.value ?? "").toString().trim();
      applyFlowFilter(term);
      return;
    }

    if (msg.type === "applySearchAttributes") {
      const term = (msg.value ?? "").toString().trim();
      applyAttributeFilter(term);
    }
  }

  // === FLOW NAME FILTER ===
  function applyFlowFilter(term: string) {
    if (!term) {
      table?.setData(originalData);
      return;
    }
    const filtered = originalData.filter(row => 
      row.flowName?.toString().toLowerCase().includes(term.toLowerCase())
    );
    table?.setData(filtered);
  }

  // === ATTRIBUTES FILTER ===
  function applyAttributeFilter(term: string) {
    if (!term) {
      table?.setData(originalData);
      return;
    }
    const filtered = originalData.filter(row => {
      return [
        row.name, row.severity, row.type,
        row.lineNumber, row.columnNumber,
        row.connectsTo, row.expression, row.dataType
      ].some(val => val?.toString().toLowerCase().includes(term.toLowerCase()));
    });
    table?.setData(filtered);
  }
</script>

<svelte:window on:message={onMessage} />
<div bind:this={tableComponent} class="tabulator-table" />