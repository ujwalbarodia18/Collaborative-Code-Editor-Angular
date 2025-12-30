import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { roomEndPoints } from '../../../constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private api: ApiService) {}

  generateRoom() {
    return this.api.post(roomEndPoints.createRoom).pipe(map((res: any) => {
      if (res?.data?.roomId) {
        return res.data.roomId;
      }
      return "";
    }));
  }
}
