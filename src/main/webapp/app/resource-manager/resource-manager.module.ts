import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OdosCrrsUiSharedModule } from '../shared';
import { RESOURCE_MANAGER_ROUTE, ResourceManagerComponent, buildingDialogRoute, conferenceRoomDialogRoute, equipmentDialogRoute } from './';
import { ResourceManagerService } from './resource-manager.service';
import { ResourceModalService } from './resource-modal.service';

import { ResourceBuildingDialogComponent, 
         ResourceConferenceRoomDialogComponent, 
         ResourceEquipmentDialogComponent,
         ResourceDialogComponent
} from './resource-manager-dialog.component';

@NgModule({
    imports: [
        OdosCrrsUiSharedModule,
        RouterModule.forChild([ RESOURCE_MANAGER_ROUTE ]),
        RouterModule.forChild([ buildingDialogRoute ]),
        RouterModule.forChild([ conferenceRoomDialogRoute ]),
        RouterModule.forChild( equipmentDialogRoute )
    ],
    declarations: [
        ResourceManagerComponent, 
        ResourceBuildingDialogComponent, 
        ResourceConferenceRoomDialogComponent, 
        ResourceEquipmentDialogComponent,
        ResourceDialogComponent
    ],
    entryComponents: [
        ResourceBuildingDialogComponent,
        ResourceConferenceRoomDialogComponent, 
        ResourceEquipmentDialogComponent,
        ResourceDialogComponent
    ],
    providers: [
        ResourceManagerService,
        ResourceModalService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OdosCrrsUiResourceManagerModule {}
