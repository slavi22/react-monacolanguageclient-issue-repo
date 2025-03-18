import { Uri } from 'vscode';

export type FileDefinition = {
    path: string;
    code: string;
    uri: Uri;
}

export type ConfigParams = {
    extensionName?: string;
    languageId: string;
    documentSelector: string[];
    homeDir: string;
    workspaceRoot: string;
    workspaceFile?: Uri;
    htmlContainer?: HTMLElement;
    protocol: 'ws' | 'wss';
    hostname: string;
    port: number;
    files: Map<string, FileDefinition>;
    defaultFile: string;
    helpContainerCmd?: string;
    debuggerExecCall?: string;
}