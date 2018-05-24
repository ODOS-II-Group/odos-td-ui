import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OdosCrrsUiSharedModule } from '../shared';
import { REPORT_ROUTE, ReportComponent } from './';
import { ReportService} from "./report.service";

@NgModule({
    imports: [
        OdosCrrsUiSharedModule,
        RouterModule.forChild([ REPORT_ROUTE ])
    ],
    declarations: [
        ReportComponent,
    ],
    entryComponents: [
    ],
    providers: [
        ReportService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OdosCrrsUiReportModule {}
