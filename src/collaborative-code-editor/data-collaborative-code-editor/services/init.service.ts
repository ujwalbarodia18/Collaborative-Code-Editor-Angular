import { Injectable } from "@angular/core";
import { UserService } from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class InitService {
  constructor(private us: UserService) {}

  init() {
    // this.us
  }
}
