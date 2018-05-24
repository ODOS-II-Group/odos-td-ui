import './vendor.ts';

import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ng2Webstorage, LocalStorageService, SessionStorageService  } from 'ngx-webstorage';
import { JhiEventManager } from 'ng-jhipster';

import { AuthInterceptor } from './blocks/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from './blocks/interceptor/notification.interceptor';
import { OdosCrrsUiSharedModule, UserRouteAccessService, CapitalizeFirstPipe } from './shared';
import { OdosCrrsUiAppRoutingModule} from './app-routing.module';
import { OdosCrrsUiHomeModule } from './home';
import { OdosCrrsUiConferenceRoomModule } from './conference-room';
import { OdosCrrsUiReservationModule } from './reservation';
import { OdosCrrsUiReportModule } from "./report";
import { OdosCrrsUiResourceManagerModule } from "./resource-manager";
import { OdosCrrsUiAdminModule } from './admin/admin.module';
import { OdosCrrsUiAccountModule } from './account/account.module';
import { OdosCrrsUiEntityModule } from './entities/entity.module';
import { PaginationConfig } from './blocks/config/uib-pagination.config';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }  from '@angular/common';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import {
    JhiMainComponent,
    NavbarComponent,
    FooterComponent,
    ProfileService,
    PageRibbonComponent,
    ErrorComponent
} from './layouts';


@NgModule({
    imports: [
        BrowserModule,
        OdosCrrsUiAppRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-'}),
        OdosCrrsUiSharedModule,
        OdosCrrsUiHomeModule,
        OdosCrrsUiConferenceRoomModule,
        OdosCrrsUiReservationModule,
        OdosCrrsUiResourceManagerModule,
        OdosCrrsUiReportModule,
        OdosCrrsUiAdminModule,
        OdosCrrsUiAccountModule,
        OdosCrrsUiEntityModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
        // jhipster-needle-angular-add-module JHipster will add new module here
    ],
    declarations: [
        JhiMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        FooterComponent,
        CapitalizeFirstPipe,
    ],
    providers: [
        ProfileService,
        PaginationConfig,
        UserRouteAccessService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
            deps: [
                LocalStorageService,
                SessionStorageService
            ]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true,
            deps: [
                Injector
            ]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true,
            deps: [
                JhiEventManager
            ]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationInterceptor,
            multi: true,
            deps: [
                Injector
            ],
        }
    ],
    bootstrap: [ JhiMainComponent ]
})
export class OdosCrrsUiAppModule {}
