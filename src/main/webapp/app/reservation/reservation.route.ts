import { Route } from '@angular/router';

import { ReservationComponent } from './';

export const RESERVATION_ROUTE: Route = {
    path: 'reservation/:roomName',
    component: ReservationComponent,
    data: {
        authorities: [],
        pageTitle: 'Reserve a room'
    }
};
