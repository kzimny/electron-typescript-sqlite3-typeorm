import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { DatabaseService } from '../services/database.service';
import { TUser, TPicture } from '../entities';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-crv',
    templateUrl: './app.template.html',
})
export class AppComponent implements OnInit {
    public readonly title = 'Electron + Sqlite + typeorm';
    userList: TUser[];
    imageList: TPicture[];
    pathWebpack: string;

    constructor(
        private dbservice: DatabaseService,
        private sanitizer: DomSanitizer) {
            this.pathWebpack = MAIN_WINDOW_WEBPACK_ENTRY;
        }

    ngOnInit(): void {
        forkJoin(this.dbservice.getUsers(),
        this.dbservice.getPictures())
        .subscribe(
            result => {
                this.userList = result[0];
                this.imageList = result[1];
            }
        );
    }

    addUser(): void {
        let user = new TUser();
        user.FirstName = 'FName' + this.userList.length;
        user.LastName = 'LName' + this.userList.length;
        this.dbservice.addUser(user).subscribe((user) => (this.userList = user));
    }

    deleteUser(): void {
        if (this.userList.length > 0) {
            const user = this.userList[this.userList.length - 1];
            this.dbservice
            .deleteUser(user)
            .subscribe((users) => (this.userList = users));
        }
    }

    // getPicture(image: Buffer): SafeUrl {

    //     // convert the Unicode values into a string of characters
    //     const stringChar = String.fromCharCode.apply(null, image);
    //     // pass the string of characters to window.btoa() method
    //     // which will return a base-64 encoded ASCII string
    //     let base64String = btoa(stringChar);
    //     // append the base64 string to the data URL and bypass sanitization
    //     return this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String);
    // }
}
