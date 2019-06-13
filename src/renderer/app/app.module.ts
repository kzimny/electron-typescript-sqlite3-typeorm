import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { ElectronService } from 'ngx-electron';
import { DatabaseService } from '../services/database.service';

@NgModule({
    imports: [ BrowserModule ],
    declarations: [ AppComponent ],
    bootstrap: [ AppComponent ],
    providers: [ DatabaseService, ElectronService ]
})
export class AppModule {}
