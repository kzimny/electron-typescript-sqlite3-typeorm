import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { createConnection } from 'typeorm';
import { TUser, TPicture } from '../renderer/entities/index';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null;

const isDevMode = process.execPath.match(/[\\/]electron/);

function getDbPath(): string {
    if (isDevMode) {
        return './src/assets/data/test.db';
    } else {
        return process.platform === 'win32' ?
        path.resolve('./', 'test.db') :
        path.resolve(app.getAppPath(), '/../../../../test.db' );
    }
}

const createWindow = async () => {

    const connection = await createConnection({
        type: 'sqlite',
        synchronize: true,
        logging: false,
        logger: 'simple-console',
        database: getDbPath(),
        entities: [ TUser, TPicture ]
    });

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    const userRepo = connection.getRepository(TUser);
    const pictureRepo = connection.getRepository(TPicture);

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // const y = userRepo.find().then(w => {
    //     console.log(w);
    // });

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

    // ipcMain.on('get-settings', async (event: any, ..._args: any[]) => {
    //     try {
    //         const x =  path.resolve('./', 'test.db');
    //         const y = path.resolve(app.getAppPath(), '../../test.db');
    //         const z = path.resolve('../../', 'test.db');
    //         event.returnValue = await x + ' - ' + y + ' - ' + z;
    //     } catch (err) {
    //         throw err;
    //     }
    // });

    ipcMain.on('get-users', async (event: any, ..._args: any[]) => {
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

    ipcMain.on('get-pictures', async (event: any, ..._args: any[]) => {
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
