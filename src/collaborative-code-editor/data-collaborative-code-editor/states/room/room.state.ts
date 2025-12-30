import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { RoomService } from "../../services/room.service";
import { RoomActions } from "./room.action";
import { withLoading } from "../../../common/helpers/utils";
import { tap } from "rxjs";
import { patch } from "@ngxs/store/operators";

export interface RoomStateModel {
  showCreateRoomLoader: boolean;
  lastGeneratedRoomId?: string;
}
@State<RoomStateModel>({
  name: 'room',
  defaults: {
    showCreateRoomLoader: false,
  }
})
@Injectable()
export class RoomState {
  constructor (private roomService: RoomService) {};

  @Selector()
  static getShowCreateRoomLoader(state: RoomStateModel) {
    return state.showCreateRoomLoader;
  }

  @Action(RoomActions.CreateRoom)
  createRoom(ctx: StateContext<RoomStateModel>) {
    console.log("Create room");
    return withLoading(
      ctx,
      this.roomService.generateRoom().pipe(
        tap((d: any) => {
          ctx.setState(
            patch<RoomStateModel>(
              {
                lastGeneratedRoomId: d?.data?.roomId
              }
            )
          )
        })
      ),
      'showCreateRoomLoader'
    )
  }
}
