const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron');
const fs = require('fs/promises');
const path = require('path');
const isBinaryFile = require('isbinaryfile');

let mainWindow = null;
let pendingOpenFile = null;

// require('electron-debug')({ showDevTools: true });

function resolveCliFile() {
    const args = process.argv.slice(2);
    let useNext = false;

    for (const arg of args) {
        if (useNext) {
            return arg;
        }
        if (arg === '--') {
            useNext = true;
            continue;
        }
        if (arg.startsWith('-')) {
            continue;
        }
        return arg;
    }

    return null;
}

function normalizeFilePath(filePath) {
    if (!filePath) {
        return null;
    }
    const resolved = path.isAbsolute(filePath)
        ? filePath
        : path.resolve(process.cwd(), filePath);
    return resolved;
}

const cliFile = normalizeFilePath(resolveCliFile());
const readFile = cliFile;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'resources', 'icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    if (readFile) {
        mainWindow.webContents.once('did-finish-load', () => {
            sendToRenderer('app-open-file', readFile);
        });
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.on('maximize', () => {});
    return mainWindow;
}

function sendToRenderer(channel, payload) {
    if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send(channel, payload);
    }
}

function buildMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => sendToRenderer('menu-open-file')
                },
                {
                    label: 'Save',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => sendToRenderer('menu-save-file')
                },
                {
                    label: 'Save as',
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click: () => sendToRenderer('menu-save-file-as')
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
                { label: 'Redo', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
                { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
                { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
                { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'Alt+R',
                    click: (_, focusedWindow) => {
                        if (focusedWindow) {
                            focusedWindow.reload();
                        }
                    }
                },
                {
                    label: 'Toggle Full Screen',
                    accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
                    click: (_, focusedWindow) => {
                        if (focusedWindow) {
                            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                        }
                    }
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                    click: (_, focusedWindow) => {
                        if (focusedWindow) {
                            focusedWindow.toggleDevTools();
                        }
                    }
                }
            ]
        },
        {
            label: 'Window',
            role: 'window',
            submenu: [
                { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
                { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' }
            ]
        },
        {
            label: 'Help',
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: () => shell.openExternal('https://www.electronjs.org')
                }
            ]
        }
    ];

    if (process.platform === 'darwin') {
        const name = app.getName();
        template.unshift({
            label: name,
            submenu: [
                { label: `About ${name}`, role: 'about' },
                { type: 'separator' },
                { label: 'Services', role: 'services', submenu: [] },
                { type: 'separator' },
                { label: `Hide ${name}`, accelerator: 'Command+H', role: 'hide' },
                { label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideothers' },
                { label: 'Show All', role: 'unhide' },
                { type: 'separator' },
                { label: 'Quit', accelerator: 'Command+Q', role: 'quit' }
            ]
        });

        template[4].submenu.push(
            { type: 'separator' },
            { label: 'Bring All to Front', role: 'front' }
        );
    }

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

ipcMain.handle('dialog:open-markdown', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        filters: [{ name: 'markdown', extensions: ['txt', 'md', 'markdown'] }]
    });
    if (result.canceled || result.filePaths.length === 0) {
        return null;
    }
    return result.filePaths[0];
});

ipcMain.handle('dialog:save-markdown', async () => {
    const result = await dialog.showSaveDialog(mainWindow, {
        filters: [{ name: 'Save as', extensions: ['txt', 'md', 'markdown'] }]
    });
    if (result.canceled || !result.filePath) {
        return null;
    }
    return result.filePath;
});

ipcMain.handle('dialog:open-image', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        filters: [{ name: 'Insert image', extensions: ['jpg', 'gif', 'svg', 'png', 'mp4'] }]
    });
    if (result.canceled || result.filePaths.length === 0) {
        return null;
    }
    return result.filePaths[0];
});

ipcMain.handle('dialog:open-video', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        filters: [{ name: 'Insert video', extensions: ['mp4'] }]
    });
    if (result.canceled || result.filePaths.length === 0) {
        return null;
    }
    return result.filePaths[0];
});

ipcMain.handle('dialog:open-file', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        filters: [{ name: 'Insert file', extensions: ['*'] }]
    });
    if (result.canceled || result.filePaths.length === 0) {
        return null;
    }
    return result.filePaths[0];
});

ipcMain.handle('fs:read-text', async (event, filePath) => {
    if (typeof filePath !== 'string' || filePath.length === 0) {
        throw new Error('Invalid file path.');
    }
    const resolved = path.resolve(filePath);
    return fs.readFile(resolved, 'utf-8');
});

ipcMain.handle('fs:write-text', async (event, filePath, data) => {
    if (typeof filePath !== 'string' || filePath.length === 0) {
        throw new Error('Invalid file path.');
    }
    const resolved = path.resolve(filePath);
    await fs.writeFile(resolved, data);
    return true;
});

ipcMain.handle('fs:is-binary', async (event, filePath) => {
    if (typeof filePath !== 'string' || filePath.length === 0) {
        return true;
    }
    return isBinaryFile.sync(filePath);
});

ipcMain.handle('shell:open-external', async (event, url) => {
    if (typeof url !== 'string' || url.length === 0) {
        return false;
    }
    let parsed;
    try {
        parsed = new URL(url);
    } catch (err) {
        return false;
    }
    const allowedProtocols = new Set(['http:', 'https:', 'mailto:', 'file:']);
    if (!allowedProtocols.has(parsed.protocol)) {
        return false;
    }
    await shell.openExternal(parsed.toString());
    return true;
});

app.whenReady().then(() => {
    createWindow();
    buildMenu();

    if (pendingOpenFile) {
        sendToRenderer('app-open-file', pendingOpenFile);
        pendingOpenFile = null;
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    } else if (mainWindow) {
        mainWindow.restore();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('open-file', (event, filePath) => {
    event.preventDefault();
    if (mainWindow) {
        sendToRenderer('app-open-file', filePath);
    } else {
        pendingOpenFile = filePath;
    }
});
