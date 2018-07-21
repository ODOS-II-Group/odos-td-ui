import {EquipmentInfo} from "../conference-room/conference-room.model";

export class BuildingInfo {
    constructor(
        public buildingId: number,
        public buildingName: string,
        public buildingDesc: string,
        public conferenceRooms: ConfRoomInfo[]
    ) { }
}

export class ConfRoomInfo{
    constructor(
        public conferenceRoomId: number,
        public buildingId: number,
        public roomNum: string,
        public roomName: string,
        public roomCapacity: number,
        public activeIndicator: string,
        public schedule: any,
        public equipments: EquipmentInfo
    ){ }
}
