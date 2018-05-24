export class BuildingInfo {
    constructor(
        public building_name: string,
        public building_description: string,
        public conference_rooms: BasicRoomInfo[]
    ) { }
}

export class BasicRoomInfo{
    constructor(
        public room_number: string,
        public room_name: string
    ){ }
}
