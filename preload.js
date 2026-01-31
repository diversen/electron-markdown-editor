const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    openExternal: (url) => ipcRenderer.invoke('shell:open-external', url),
    openMarkdownDialog: () => ipcRenderer.invoke('dialog:open-markdown'),
    saveMarkdownDialog: () => ipcRenderer.invoke('dialog:save-markdown'),
    openImageDialog: () => ipcRenderer.invoke('dialog:open-image'),
    openVideoDialog: () => ipcRenderer.invoke('dialog:open-video'),
    openFileDialog: () => ipcRenderer.invoke('dialog:open-file'),
    readTextFile: (filePath) => ipcRenderer.invoke('fs:read-text', filePath),
    writeTextFile: (filePath, data) => ipcRenderer.invoke('fs:write-text', filePath, data),
    isBinaryFile: (filePath) => ipcRenderer.invoke('fs:is-binary', filePath),
    onMenuOpenFile: (handler) => ipcRenderer.on('menu-open-file', handler),
    onMenuSaveFile: (handler) => ipcRenderer.on('menu-save-file', handler),
    onMenuSaveFileAs: (handler) => ipcRenderer.on('menu-save-file-as', handler),
    onAppOpenFile: (handler) => ipcRenderer.on('app-open-file', handler)
});
