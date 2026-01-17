import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { Component } from '@angular/core';
import { UiButtonComponent } from "../../form-components/ui-button/ui-button.component";
import { RoomActions } from '../../data-collaborative-code-editor/states/room/room.action';
import { UserService } from '../../data-collaborative-code-editor/services/user.service';
import { RoomState } from '../../data-collaborative-code-editor/states/room/room.state';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { UiDialogComponent } from '../../ui-components/ui-dialog/ui-dialog.component';
import { RoomFormComponent } from '../../feature-collaborative-code-editor/guest-form/room-form.component';

@Component({
  selector: 'ui-sidebar',
  imports: [AsyncPipe, RouterLink, RouterLinkActive, UiDialogComponent, RoomFormComponent],
  templateUrl: './ui-sidebar.component.html',
  styleUrl: './ui-sidebar.component.scss',
})
export class UiSidebarComponent {
  recentlyVisitedRooms$!: Observable<any[]>;
  showNewRoomDialog: boolean = false;
  formType?: 'join' | 'host';

  constructor(private store: Store, private us: UserService) {}

  ngOnInit() {
    const user = this.us.getUser();
    if (user?.userId) {
      this.store.dispatch(new RoomActions.FetchRecentlyVisitedRooms(user?.userId));
    }
    this.recentlyVisitedRooms$ = this.store.select(RoomState.getRecentlyVisitedRooms);
  }

  openNewRoomDialog(type: 'join' | 'host') {
    this.showNewRoomDialog = true;
    this.formType = type;
  }

  closeNewRoomDialog() {
    this.showNewRoomDialog = false;
    this.formType = undefined;
  }
}
