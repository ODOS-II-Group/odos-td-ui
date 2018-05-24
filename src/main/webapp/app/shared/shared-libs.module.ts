import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgJhipsterModule } from 'ng-jhipster';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CookieModule } from 'ngx-cookie';
import { ChartModule} from "primeng/chart";
import { CalendarModule } from 'primeng/calendar';

@NgModule({
    imports: [
        NgbModule.forRoot(),
        NgJhipsterModule.forRoot({
            // set below to true to make alerts look like toast
            alertAsToast: false,
        }),
        InfiniteScrollModule,
        CookieModule.forRoot()
    ],
    exports: [
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        CommonModule,
        NgbModule,
        CalendarModule,
        NgJhipsterModule,
        ChartModule,
        InfiniteScrollModule
    ]
})
export class OdosCrrsUiSharedLibsModule {}
