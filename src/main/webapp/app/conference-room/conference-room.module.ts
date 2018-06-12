import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { RouterModule } from '@angular/router';

import { OdosCrrsUiSharedModule } from '../shared';
import { CONFERENCE_ROOM_ROUTE, ConferenceRoomComponent } from "./";
import { ConferenceRoomService } from './conference-room.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        OdosCrrsUiSharedModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([ CONFERENCE_ROOM_ROUTE ])
    ],
    declarations: [
        ConferenceRoomComponent,
    ],
    entryComponents: [
    ],
    providers: [
        ConferenceRoomService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OdosCrrsUiConferenceRoomModule {}

