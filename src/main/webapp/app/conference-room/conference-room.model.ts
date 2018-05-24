export class BuildingInfo {
    constructor(
        public buildingId: number,
        public buildingName: string,
        public buildingDesc: string,
        public conferenceRooms: RoomInfo[]
    ) { }
}

export class RoomInfo {
    constructor(
        private conferenceRoomId: number,
        public roomName: string,
        public roomNum: number,
        public roomCapacity: number,
        public equipments: EquipmentInfo[]
    ){ }
}

export class EquipmentInfo{
    constructor(
        public equipmentId: number,
        public equipmentName: string,
        public equipmentDesc: string
    ){ }
}
