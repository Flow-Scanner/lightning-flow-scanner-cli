<script>
  import TailwindWrapper from "./commons/TailwindWrapper.svelte";
  import Banner from "./Banner.svelte";
  import { onMount } from "svelte";

  let selectedRating = 0;
  let hoverStar = 0;
  let currentRating = null;
  let numReviews = 0;
  let loading = true;
  let isVSCode = false;
  let marketplace = "openvsx";

  // Documentation preferences
  let showDocOptions = false;
  let docMode = 'combined'; // 'combined' | 'separate'
  let docIncludeDetails = true;
  let docCollapsedDetails = true;
  let docOptionsConfigured = false;
  let outputDir = '';

  // Load preferences + environment
  onMount(async () => {
    const handler = (event) => {
      const message = event.data;
      if (message.type === 'docOutputDirSelected') {
        docOutputDir = message.path;
      }
      if (message.type === "initEnvironment") {
        isVSCode = message.isVSCode;
        marketplace = message.marketplace;
        window.removeEventListener("message", handler);
        fetchCurrentRating();
      }
    };
    window.addEventListener("message", handler);

    setTimeout(() => {
      if (!isVSCode) {
        window.removeEventListener("message", handler);
        fetchCurrentRating();
      }
    }, 1000);

    // Load doc preferences from cache
    try {
      const prefs = await getCache('docPreferences');
      if (prefs) {
        docMode = prefs.mode || 'combined';
        docIncludeDetails = prefs.includeDetails ?? true;
        docCollapsedDetails = prefs.collapsedDetails ?? true;
        outputDir = prefs.outputDir || '';
      }
    } catch (e) {
      console.log('Using default doc preferences');
    }
  });

  async function getWorkspaceRoot() {
    return new Promise((resolve) => {
      const nonce = Date.now().toString();
      const handler = (event) => {
        const msg = event.data;
        if (msg.type === 'workspaceRoot' && msg.nonce === nonce) {
          window.removeEventListener('message', handler);
          resolve(msg.path || '');
        }
      };
      window.addEventListener('message', handler);
      tsvscode.postMessage({ type: 'getWorkspaceRoot', nonce });
    });
  }

  async function selectOutputDir() {
    const newPath = await new Promise((resolve) => {
      const nonce = Date.now().toString();
      const handler = (event) => {
        const msg = event.data;
        if (msg.type === 'selectedFolder' && msg.nonce === nonce) {
          window.removeEventListener('message', handler);
          resolve(msg.path);
        }
      };
      window.addEventListener('message', handler);
      tsvscode.postMessage({ type: 'selectOutputFolder', nonce });
    });
    if (newPath) {
      outputDir = newPath;
      docOptionsConfigured = true;
    }
  }

  // Cache helpers
  async function getCache(key) {
    return new Promise((resolve, reject) => {
      const nonce = Date.now().toString();
      const handler = (event) => {
        const msg = event.data;
        if (msg.nonce === nonce) {
          window.removeEventListener('message', handler);
          if (msg.ok) resolve(msg.data);
          else reject(new Error(msg.error));
        }
      };
      window.addEventListener('message', handler);
      tsvscode.postMessage({ type: 'getCache', key, nonce });
      setTimeout(() => {
        window.removeEventListener('message', handler);
        reject(new Error('timeout'));
      }, 5000);
    });
  }

  async function setCache(key, value) {
    return new Promise((resolve, reject) => {
      const nonce = Date.now().toString();
      const handler = (event) => {
        const msg = event.data;
        if (msg.nonce === nonce) {
          window.removeEventListener('message', handler);
          if (msg.ok) resolve(msg.data);
          else reject(new Error(msg.error));
        }
      };
      window.addEventListener('message', handler);
      tsvscode.postMessage({ type: 'setCache', key, value, nonce });
      setTimeout(() => {
        window.removeEventListener('message', handler);
        reject(new Error('timeout'));
      }, 5000);
    });
  }

  // Save doc preferences before generating
  async function saveDocPreferences() {
    try {
      await setCache('docPreferences', {
        mode: docMode,
        includeDetails: docIncludeDetails,
        collapsedDetails: docCollapsedDetails,
        outputDir
      });
    } catch (e) {
      console.error('Failed to save preferences:', e);
    }
  }

  async function fetchCurrentRating() {
    try {
      if (isVSCode && marketplace === "vscode") {
        // VS Code Marketplace API
        const resp = await fetch("https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery", {
          method: "POST",
          headers: {
            "Accept": "application/json;api-version=7.2-preview.1",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            filters: [{ criteria: [{ filterType: 7, value: "ForceConfigControl.lightning-flow-scanner-vsx" }]}],
            flags: 914
          })
        });
        if (!resp.ok) throw new Error("fetch failed");
        const data = await resp.json();
        const ext = data.results[0]?.extensions[0];
        if (ext) {
          const avg = ext.statistics.find(s => s.statisticName === "averagerating")?.value;
          const count = ext.statistics.find(s => s.statisticName === "ratingcount")?.value;
          currentRating = avg ? avg.toFixed(1) : null;
          numReviews = count || 0;
        }
      } else {
        // Open VSX fallback
        const resp = await fetch("https://open-vsx.org/api/-/reviews?extensionId=ForceConfigControl.lightning-flow-scanner-vsx&targetPlatform=UNIVERSAL");
        if (!resp.ok) throw new Error("fetch failed");
        const reviews = await resp.json();
        const ratings = reviews.map(r => r.rating);
        if (ratings.length > 0) {
          currentRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
          numReviews = ratings.length;
        } else {
          currentRating = null;
          numReviews = 0;
        }
      }
    } catch (e) {
      console.error("Rating fetch error:", e);
      currentRating = null;
      numReviews = 0;
    } finally {
      loading = false;
    }
  }

  function rateAndRedirect(rating) {
    selectedRating = rating;
    if (isVSCode) {
      tsvscode.postMessage({
        type: "openReviewPage",
        url: "https://marketplace.visualstudio.com/items?itemName=ForceConfigControl.lightning-flow-scanner-vsx"
      });
    } else {
      window.open("https://open-vsx.org/extension/ForceConfigControl/lightning-flow-scanner-vsx/reviews", "_blank");
    }
  }

  function openDocumentation() { tsvscode.postMessage({ type: "openDocumentation" }); }
  function configRules()      { tsvscode.postMessage({ type: "configRules" }); }
  function scanFlows()        { tsvscode.postMessage({ type: "scanFlows" }); }
  function fixFlows()         { tsvscode.postMessage({ type: "fixFlows" }); }
  
  function generateFlowDocs() {
  tsvscode.postMessage({
    type: "generateFlowDocs",
    options: {
      mode: docMode,
      includeDetails: docIncludeDetails,
      collapsedDetails: docCollapsedDetails,
      outputDir: outputDir || undefined,
      configuredViaSidebar: true // now true because the user explicitly clicked
    }
  });
}

</script>

<TailwindWrapper>
  <div class="sb">
    <Banner />
    <nav aria-label="Sidebar" class="flex flex-col gap-3">
      <button class="btn btn-blue" on:click={configRules}>⚙️ Configure Rules</button>
      <button class="btn btn-blue" on:click={scanFlows}>🔍 Scan Flows</button>
      <button class="btn btn-blue" on:click={fixFlows}>🔧 Fix Flows</button>
      
      <!-- Documentation Section with Options -->
      <div class="border-t border-gray-300 pt-3 mt-2">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs text-gray-500 uppercase font-semibold">Documentation</p>
          <button 
            class="text-xs text-blue-600 hover:underline"
            on:click={() => showDocOptions = !showDocOptions}
          >
            {showDocOptions ? 'Hide Options' : 'Show Options'}
          </button>
        </div>
        
        {#if showDocOptions}
          <div class="bg-gray-50 rounded p-3 mb-2 space-y-2">
            <div>
              <label class="text-xs font-medium text-gray-700 block mb-1">Output Mode</label>
              <select bind:value={docMode} class="w-full text-sm border rounded px-2 py-1">
                <option value="combined">📄 Single Document</option>
                <option value="separate">📚 One File Per Flow</option>
              </select>
            </div>
            
            <div class="flex items-center gap-2">
              <input type="checkbox" id="includeDetails" bind:checked={docIncludeDetails} on:change={() => (docOptionsConfigured = true)} class="rounded" />
              <label for="includeDetails" class="text-xs text-gray-700">Include node details</label>
            </div>
            
            {#if docIncludeDetails}
              <div class="flex items-center gap-2 ml-6">
                <input type="checkbox" id="collapsedDetails" bind:checked={docCollapsedDetails} class="rounded" />
                <label for="collapsedDetails" class="text-xs text-gray-700">Collapse by default</label>
              </div>
            {/if}

            <div>
              <label class="text-xs font-medium text-gray-700 block mb-1">Output Folder</label>
              <div class="flex gap-2">
                <input type="text" bind:value={outputDir} class="flex-1 text-sm border rounded px-2 py-1" readonly />
                <button on:click={selectOutputDir} class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">Browse</button>
              </div>
            </div>
          </div>
        {/if}
        
        <button class="btn btn-green w-full" on:click={generateFlowDocs}>
          📚 Generate Docs
        </button>
      </div>
      
      <button class="btn btn-blue mt-2" on:click={openDocumentation}>📖 Scanner Help</button>

      <!-- Rating Section -->
      <div class="mt-4 p-3">
        {#if loading}
          <p class="text-sm text-gray-500 text-center mb-2">Loading rating…</p>
        {:else if currentRating !== null}
          <p class="text-sm text-gray-600 text-center mb-2">
            Current Rating: {currentRating}/5 ({numReviews} review{numReviews !== 1 ? "s" : ""})
          </p>
        {:else}
          <p class="text-sm text-gray-500 text-center mb-2">No reviews yet</p>
        {/if}

        <div class="flex justify-center gap-1">
          {#each [1, 2, 3, 4, 5] as star}
            <button
              class="star-btn text-2xl transition-all duration-200 hover:scale-110 focus:outline-none"
              on:click={() => rateAndRedirect(star)}
              on:mouseover={() => (hoverStar = star)}
              on:mouseout={() => (hoverStar = 0)}
              aria-label={`Rate {star} star${star > 1 ? "s" : ""}`}
            >
              {#if star <= (hoverStar || selectedRating)} ⭐ {:else} ☆ {/if}
            </button>
          {/each}
        </div>
      </div>
    </nav>

    <p class="mt-6 text-center text-sm text-gray-600">
      Since 2021, built by the community.
      <a
        href="https://github.com/Flow-Scanner/lightning-flow-scanner?tab=contributing-ov-file"
        target="_blank"
        class="text-blue-600 font-medium hover:underline"
      >
        Join us.
      </a>
    </p>
  </div>
</TailwindWrapper>

<style>
  .btn-blue {
    @apply bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition;
  }
  .btn-green {
    @apply bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 transition;
  }
  .sb {
    @apply flex flex-col;
  }
  .btn {
    @apply font-bold py-2 my-2 px-4 rounded;
  }
</style>