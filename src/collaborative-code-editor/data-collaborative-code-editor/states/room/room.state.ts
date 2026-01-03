import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { RoomService } from "../../services/room.service";
import { RoomActions } from "./room.action";
import { withLoading } from "../../../common/helpers/utils";
import { tap } from "rxjs";
import { patch } from "@ngxs/store/operators";

export interface RoomStateModel {
  showCreateRoomLoader: boolean;
  lastGeneratedRoomId: string;
}
@State<RoomStateModel>({
  name: 'room',
  defaults: {
    showCreateRoomLoader: false,
    lastGeneratedRoomId: ''
  }
})
@Injectable()
export class RoomState {
  constructor (private roomService: RoomService) {};

  @Selector()
  static getShowCreateRoomLoader(state: RoomStateModel) {
    return state.showCreateRoomLoader;
  }

  @Selector()
  static getLastGeneratedRoomId(state: RoomStateModel) {
    return state.lastGeneratedRoomId;
  }

  @Action(RoomActions.CreateRoom)
  createRoom(ctx: StateContext<RoomStateModel>, { roomDetails }: RoomActions.CreateRoom) {
    return withLoading(
      ctx,
      this.roomService.generateRoom(roomDetails).pipe(
        tap((d: any) => {
          ctx.setState(
            patch<RoomStateModel>(
              {
                lastGeneratedRoomId: d?.data?.roomId,
              }
            )
          )
        })
      ),
      'showCreateRoomLoader'
    )
  }

  @Action(RoomActions.GetRoomById)
  getRoomById(ctx: StateContext<RoomStateModel>, {roomId}: RoomActions.GetRoomById) {
    return this.roomService.getRoomById(roomId).pipe(
      tap(d => {
        console.log("D", d);
      })
    )
  }

  @Action(RoomActions.ClearLastGeneratedRoom)
  getClearLastGeneratedRoom(ctx: StateContext<RoomStateModel>) {
    ctx.setState(
      patch<RoomStateModel>({
        lastGeneratedRoomId: ''
      })
    )
  }
}
