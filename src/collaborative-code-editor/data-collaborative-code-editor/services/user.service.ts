import { Injectable } from '@angular/core';
import { User } from '../../common/models/user';
import { commonEndPoints, GUEST_KEY } from '../../../constants';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  activatedUser?: User;
  user?: User;

  constructor(private api: ApiService) {}

  setUser(): Observable<any> {
    return this.api.post(commonEndPoints.getUserDetails).
    pipe(
      tap(d => {
        const user: User = d?.data?.user;

        if (!user) {
          return;
        }
        user.color = this.getUserColor(user.userId);
        this.user = user;
      })
    );
  }

  getUser() {
    return this.user;
  }

  createGuestUser(name: string) {
    const userId = crypto.randomUUID();
    const user = {
      userId: userId,
      name,
      color: this.getUserColor(userId),
      isGuest: true
    };

    localStorage.setItem(GUEST_KEY, JSON.stringify(user));

    this.activatedUser = user;
  }

  getGuestUser(): User | null {
    const raw = localStorage.getItem(GUEST_KEY);
    if (raw) return JSON.parse(raw);

    return null;
  }

  getUserColor(userId: string, usedHues: number[] = []) {
    let hash = 0;
    for (let c of userId) {
      hash = c.charCodeAt(0) + ((hash << 5) - hash);
    }

    let hue = Math.abs(hash) % 360;

    // resolve conflicts
    while (usedHues.some(h => Math.abs(h - hue) < 25)) {
      hue = (hue + 30) % 360;
    }

    return `hsl(${hue}, 65%, 55%)`;
  }

}
