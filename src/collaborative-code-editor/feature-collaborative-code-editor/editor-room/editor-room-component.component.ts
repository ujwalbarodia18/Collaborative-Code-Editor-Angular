import { Component, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from "../../ui-components/editor/editor.component";
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../data-collaborative-code-editor/services/user.service';
import { User } from '../../common/models/user';
import { environment } from '../../../environments/environment';
import { RoomService } from '../../data-collaborative-code-editor/services/room.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { RoomActions } from '../../data-collaborative-code-editor/states/room/room.action';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-editor-room-component',
  standalone: true,
  imports: [CommonModule, EditorComponent],
  templateUrl: './editor-room-component.component.html',
  styleUrls: ['./editor-room-component.component.scss'],
})
export class EditorRoomComponentComponent {
  constructor(
    private router: ActivatedRoute,
    private us: UserService,
    private roomService: RoomService,
    private destroyRef: DestroyRef,
    private store: Store
  ) {}

  roomId: string = "";
  user?: User | null;
  webSocketServer: string = environment.websocketUrl;
  editorDetails?: any;

  ngOnInit() {
    this.user = this.us.getUser();
    this.roomId = this.router.snapshot.paramMap.get('id') ?? "";
    console.log("Room id", this.roomId);
    this.roomService.isRoomPasswordProtected(this.roomId)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(isPasswordProtected => {
        const password = isPasswordProtected ? prompt("Enter password") : "";
        const payload = {
          roomId: this.roomId,
          password
        }

        return this.roomService.getRoomById(payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
      })
    )
    .subscribe((d: any) => {
      console.log("Editor details", d);
      this.editorDetails = d.data;
    })

  }
}
