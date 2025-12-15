import { CacheProvider } from '../providers/cache-provider';
import * as vscode from 'vscode';


export default class MessageService {
  constructor(private webview: vscode.Webview) {}

  onInfo(query: any) {
    if (!query.value) {
      return;
    }
    vscode.window.showInformationMessage(query.value);
  }

  onError(query: any) {
    if (!query.value) {
      return;
    }
    vscode.window.showErrorMessage(query.value);
  }

  openDocumentation(query: any) {
    vscode.commands.executeCommand('flowscanner.openDocumentation');
  }

  scanFlows(query: any) {
    vscode.commands.executeCommand('flowscanner.scanFlows', query.options);  // ✅ Options passed
  }

  fixFlows(query: any) {
    vscode.commands.executeCommand('flowscanner.fixFlows');
  }

  generateFlowDocs(query: any) {
  vscode.commands.executeCommand('flowscanner.generateFlowDocs', query.options);
  }

  getWorkspaceRoot(query: any) {
    const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
    this.webview.postMessage({
      type: 'workspaceRoot',
      path: root,
      nonce: query.nonce
    });
  }

  async selectOutputFolder(query: any) {
    const workspace = vscode.workspace.workspaceFolders?.[0];
    if (!workspace) return;

    const uri = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      defaultUri: workspace.uri
    });

    this.webview.postMessage({
      type: 'selectedFolder',
      path: uri?.[0]?.fsPath || '',
      nonce: query.nonce
    });
  }

  configRules(query: any) {
    vscode.commands.executeCommand('flowscanner.configRules');
  }

  openVsxReviews(_query: any) {
    const reviewUrl =
      "https://open-vsx.org/extension/ForceConfigControl/lightning-flow-scanner-vsx/reviews";
    vscode.env.openExternal(vscode.Uri.parse(reviewUrl));
  }

  openReviewPage(query: any) {
  const url = query.url || "https://marketplace.visualstudio.com/items?itemName=ForceConfigControl.lightning-flow-scanner-vsx&ssr=false#review-details";
  vscode.env.openExternal(vscode.Uri.parse(url));
}

  getCache(query: any) {
    const { nonce, key } = query;
    this.sendResponse(
      () => Promise.resolve(CacheProvider.instance.get(key)),
      nonce
    );
  }

  setCache(query: any) {
    const { nonce, key, value } = query;
    this.sendResponse(
      () => Promise.resolve(CacheProvider.instance.set(key, value)),
      nonce
    );
  }

  private async sendResponse(fetchData: Function, nonce: string) {
    try {
      const result = await fetchData();
      this.webview.postMessage({
        ok: true,
        data: result,
        nonce,
      });
    } catch (e: any) {
      this.webview.postMessage({
        ok: false,
        error: e?.message || 'generic_error',
        nonce,
      });
    }
  }

  onVsMessage(data: any) {
    const { type, ...query } = data;
    if (type in this) {
      (this as any)[type](query);
    } else {
      this.sendResponse(() => Promise.reject('method not found'), query.nonce);
    }
  }
}
