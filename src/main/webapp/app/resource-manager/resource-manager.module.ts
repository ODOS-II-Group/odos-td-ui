import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OdosCrrsUiSharedModule } from '../shared';
import { RESOURCE_MANAGER_ROUTE, ResourceManagerComponent } from './';
import { ResourceManagerService } from './resource-manager.service';

@NgModule({
    imports: [
        OdosCrrsUiSharedModule,
        RouterModule.forChild([ RESOURCE_MANAGER_ROUTE ])
    ],
    declarations: [
        ResourceManagerComponent,
    ],
    entryComponents: [
    ],
    providers: [
        ResourceManagerService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OdosCrrsUiResourceManagerModule {}
