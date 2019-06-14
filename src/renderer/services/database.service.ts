import { Injectable } from '@angular/core';

import { TUser, TPicture } from '../entities/index';

import { ElectronService } from 'ngx-electron';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class DatabaseService {
    constructor(private electronService: ElectronService) {}

    getSettings(): Observable<string> {
        return of(this.electronService.ipcRenderer.sendSync('get-settings')).pipe(
            catchError((error: any) => Observable.throw(error.json))
        );
    }

    getUsers(): Observable<TUser[]> {
        return of(this.electronService.ipcRenderer.sendSync('get-users')).pipe(
            catchError((error: any) => Observable.throw(error.json))
        );
    }

    addUser(user: TUser): Observable<TUser[]> {
        return of(
            this.electronService.ipcRenderer.sendSync('add-user', user)
        ).pipe(catchError((error: any) => Observable.throw(error.json)));
    }

    deleteUser(user: TUser): Observable<TUser[]> {
        return of(
            this.electronService.ipcRenderer.sendSync('delete-user', user)
        ).pipe(catchError((error: any) => Observable.throw(error.json)));
    }

    getPictures(): Observable<TPicture[]> {
        return of(this.electronService.ipcRenderer.sendSync('get-pictures')).pipe(
            catchError((error: any) => Observable.throw(error.json))
        );
    }
}