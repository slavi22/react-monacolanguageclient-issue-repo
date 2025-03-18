import { ConfigParams, FileDefinition } from "../types/types.ts";
import * as vscode from "vscode";
import {
  RegisteredFileSystemProvider,
  RegisteredMemoryFile,
  registerFileSystemOverlay,
} from "@codingame/monaco-vscode-files-service-override";
import type { WrapperConfig } from "monaco-editor-wrapper";
import { createUrl } from "monaco-languageclient/tools";
import {
  toSocket,
  WebSocketMessageReader,
  WebSocketMessageWriter,
} from "vscode-ws-jsonrpc";
import { LogLevel } from "@codingame/monaco-vscode-api/vscode/vs/platform/log/common/log";
import { configureDefaultWorkerFactory } from "monaco-editor-wrapper/workers/workerLoaders";

export const createDefaultConfigParams = (
  homeDir: string,
  htmlContainer?: HTMLElement,
) => {
  const files = new Map<string, FileDefinition>();
  const workspaceRoot = `${homeDir}\\workspace`;
  const configParams: ConfigParams = {
    languageId: "csharp",
    documentSelector: ["cs"],
    homeDir: homeDir,
    workspaceRoot: `${homeDir}\\workspace`,
    workspaceFile: vscode.Uri.file(`${homeDir}\\.vscode\\workspace.code-workspace`),
    htmlContainer: htmlContainer,
    protocol: "ws",
    hostname: "localhost",
    port: 2000,
    files: files,
    defaultFile: `${workspaceRoot}\\Main.cs`,
  };
  const csharpMainPath = `${workspaceRoot}\\Main.cs`;
  const csharpCode =
    "public class Program\n{\n\tpublic static void Main(string[] args)\n\t{\n\n\n\t}\n}";
  files.set("Main.cs", {
    code: csharpCode,
    path: csharpMainPath,
    uri: vscode.Uri.file(csharpMainPath),
  });
  const fileSystemProvider = new RegisteredFileSystemProvider(false);
  fileSystemProvider.registerFile(
    new RegisteredMemoryFile(files.get("Main.cs")!.uri, csharpCode),
  );
  registerFileSystemOverlay(1, fileSystemProvider);
  return configParams;
};

export type CsharpAppConfig = {
  wrapperConfig: WrapperConfig;
  configParams: ConfigParams;
};

export const createCsharpConfig = (): CsharpAppConfig => {
  const configParams = createDefaultConfigParams(
    "F:\\react-monaco-csharp-lsp", //TODO: change to the appropriate path
    document.body,
  );

  const url = createUrl({
    secured: false,
    url: "ws://localhost:2000",
  });
  const webSocket = new WebSocket(url);
  const iWebSocket = toSocket(webSocket);
  const reader = new WebSocketMessageReader(iWebSocket);
  const writer = new WebSocketMessageWriter(iWebSocket);

  const wrapperConfig: WrapperConfig = {
    $type: "extended",
    htmlContainer: configParams.htmlContainer,
    logLevel: LogLevel.Debug,
    languageClientConfigs: {
      configs: {
        csharp: {
          name: "Csharp Language Server",
          connection: {
            options: {
              $type: "WebSocketDirect",
              webSocket: webSocket,
            },
            messageTransports: { reader, writer },
          },
          clientOptions: {
            documentSelector: [configParams.languageId],
            workspaceFolder: {
              index: 0,
              name: configParams.workspaceRoot,
              uri: vscode.Uri.parse(configParams.workspaceRoot),
            },
          },
        },
      },
    },
    vscodeApiConfig: {
      userConfiguration: {
        json: JSON.stringify({
          "workbench.colorTheme": "Default Dark Modern",
          "editor.guides.bracketPairsHorizontal": "active",
          "editor.wordBasedSuggestions": "off",
          "editor.experimental.asyncTokenization": true,
          "debug.toolBarLocation": "docked",
        }),
      },
      workspaceConfig: {
        enableWorkspaceTrust: true,
        workspaceProvider: {
          trusted: true,
          async open() {
            window.open(window.location.href);
            return true;
          },
          workspace: {
            workspaceUri: configParams.workspaceFile!,
          },
        },
      },
    },
    editorAppConfig: {
      monacoWorkerFactory: configureDefaultWorkerFactory,
    },
  };
  return {
    wrapperConfig: wrapperConfig,
    configParams: configParams
  }
};
