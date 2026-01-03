export namespace RoomActions {
  export class CreateRoom {
    static readonly type = '[Room] Create Room';
    constructor(public roomDetails: any) {};
  }

  export class GetRoomById {
    static readonly type = '[Room] Get Room by Id';
    constructor(public roomId: string) {}
  }

  export class ClearLastGeneratedRoom {
    static readonly type = '[Room] Clear Last Generated Room';
    constructor() {}
  }
}
