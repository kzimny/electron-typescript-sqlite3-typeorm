import { app, BrowserWindow, ipcMain } from 'electron';
import { enableLiveReload } from 'electron-compile';

import { createConnection } from 'typeorm';

import { TUser, TPicture } from './assets/entities/index';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow | null;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) {
    enableLiveReload();
}

const createWindow = async () => {

    let dbPath = isDevMode ? './src/assets/data/test.db' : './test.db';

    const connection = await createConnection({
        type: 'sqlite',
        synchronize: true,
        logging: false,
        logger: 'simple-console',
        database: dbPath,
        entities: [ TUser, TPicture ]
    });

    const userRepo = connection.getRepository(TUser);
    const pictureRepo = connection.getRepository(TPicture);

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
    });

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    // Open the DevTools.
    if (isDevMode) {
        mainWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    ipcMain.on('get-users', async (event: any, ...args: any[]) => {
        try {
            event.returnValue = await userRepo.find();
        } catch (err) {
            throw err;
        }
    });

    ipcMain.on('add-user', async (event: any, _item: TUser) => {
        try {
            const item = await userRepo.create(_item);
            await userRepo.save(item);
            event.returnValue = await userRepo.find();
        } catch (err) {
            throw err;
        }
    });

    ipcMain.on('delete-user', async (event: any, _item: TUser) => {
        try {
            const item = await userRepo.create(_item);
            await userRepo.remove(item);
            event.returnValue = await userRepo.find();
        } catch (err) {
            throw err;
        }
    });

    ipcMain.on('get-pictures', async (event: any, ...args: any[]) => {
        try {
            event.returnValue = await pictureRepo.find();
        } catch (err) {
            throw err;
        }
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
