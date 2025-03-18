import { createCsharpConfig } from "../configs/config.ts";
import * as vscode from "vscode";
import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";

export default function CustomMonacoEditor() {
  const appConfig = createCsharpConfig();
  const onLoad = async () => {
    await vscode.commands.executeCommand("workbench.view.explorer");
    await vscode.window.showTextDocument(
      appConfig.configParams.files.get("Main.cs")!.uri,
    );
  };

  return (
    <MonacoEditorReactComp
      wrapperConfig={appConfig.wrapperConfig}
      className="h-screen"
      onLoad={onLoad}
    />
  );
}
