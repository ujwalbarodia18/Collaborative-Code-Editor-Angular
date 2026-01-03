import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { roomEndPoints } from '../../../constants';
import { map, Observable, reduce } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private api: ApiService) {}

  generateRoom(roomDetails: any) {
    const { roomName, password } = roomDetails;
    const payload = {
      roomName,
      password
    }
    return this.api.post(roomEndPoints.createRoom, payload);
  }

  isRoomPasswordProtected(roomId: string): Observable<boolean> {
    const payload = {
      roomId
    }
    return this.api.post(roomEndPoints.isRoomPasswordProtected, payload).pipe(map((d: any) => !!d?.data));
  }

  getRoomById(roomDetails: any) {
    const payload = {
      ...roomDetails
    }
    return this.api.post(roomEndPoints.getRoom, payload);
  }
}
