import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from "../../ui-components/editor/editor.component";
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../data-collaborative-code-editor/services/user.service';
import { User } from '../../common/models/user';
import { environment } from '../../../environments/environment';

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
    private us: UserService
  ) {}

  roomId: string = "";
  user?: User | null;
  webSocketServer: string = environment.websocketUrl;

  ngOnInit() {
    this.user = this.us.getGuestUser();
    if (!this.user) {

    }
    this.roomId = this.router.snapshot.paramMap.get('id') ?? "";
  }
}
