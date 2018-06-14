import { Route, Routes } from '@angular/router';

import { ResourceManagerComponent } from './';
import { ResourceDialogComponent } from './resource-manager-dialog.component';

export const RESOURCE_MANAGER_ROUTE: Route = {
    path: 'resourcemanagment',
    component: ResourceManagerComponent,
    data: {
        authorities: [],
        pageTitle: 'Resource Managment Page'
    }
};

export const buildingDialogRoute: Route = {
        path: 'resource-manager/building/:buildingId/edit',
        component: ResourceDialogComponent,
        outlet: 'popup'
    };

export const conferenceRoomDialogRoute: Route = {
        path: 'resource-manager/conferenceRoom/:conferenceRoomId/edit',
        component: ResourceDialogComponent,
        outlet: 'popup'
    };

export const equipmentDialogRoute: Routes = [
    {
        path: 'resource-manager/equipment/create',
        component: ResourceDialogComponent,
        outlet: 'popup'
    },
    {
        path: 'resource-manager/equipment/:equipmentId/edit',
        component: ResourceDialogComponent,
        outlet: 'popup'
    }
];
