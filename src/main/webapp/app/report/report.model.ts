export class BuildingInfo {
    constructor(
        public building_number: string,
        public building_name: string,
        public building_address: string,
        public building_description: string,
        public conference_rooms: RoomInfo[]
    ) { }
}

export class RoomInfo {
    constructor(
        public room_name: string,
        public room_number: number,
        public room_description: string,
        public room_capacity: number,
        public equipment: EquipmentInfo[]
    ){ }
}

export class EquipmentInfo{
    constructor(
        public equipment_name: string,
    ){ }
}
