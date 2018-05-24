import { Route } from '@angular/router';

import { ResourceManagerComponent } from './';

export const RESOURCE_MANAGER_ROUTE: Route = {
    path: 'resourcemanagment',
    component: ResourceManagerComponent,
    data: {
        authorities: [],
        pageTitle: 'Resource Managment Page'
    }
};
