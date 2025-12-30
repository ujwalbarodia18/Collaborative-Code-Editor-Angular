import { Injectable } from '@angular/core';
import { User } from '../../common/models/user';
import { GUEST_KEY } from '../../../constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  activatedUser?: User;

  getUser() {
    return this.activatedUser;
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
