import { Component, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from "../../ui-components/editor/editor.component";
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserService } from '../../data-collaborative-code-editor/services/user.service';
import { User } from '../../common/models/user';
import { environment } from '../../../environments/environment';
import { RoomService } from '../../data-collaborative-code-editor/services/room.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { catchError, defer, distinctUntilChanged, filter, finalize, from, map, mergeMap, of, retryWhen, switchMap, tap, throwError } from 'rxjs';
import { PrimaryLoaderComponent } from '../../ui-components/primary-loader-component/primary-loader.component';
import { RoomPasswordComponent } from "../../ui-components/room-password/room-password-gate.component";
import { ToasterService } from '../../common/services/toast.service';

type RoomState = 'loading' | 'password' | 'ready' | 'error';
@Component({
  selector: 'app-editor-room-component',
  standalone: true,
  imports: [CommonModule, EditorComponent, PrimaryLoaderComponent, RoomPasswordComponent],
  templateUrl: './editor-room-component.component.html',
  styleUrls: ['./editor-room-component.component.scss'],
})
export class EditorRoomComponentComponent {
  constructor(
    private route: ActivatedRoute,
    private us: UserService,
    private roomService: RoomService,
    private destroyRef: DestroyRef,
    private router: Router,
    private store: Store,
    private toast: ToasterService
  ) {}

  roomId: string = "";
  user?: User | null;
  webSocketServer: string = environment.websocketUrl;
  editorDetails?: any;

  state: RoomState = 'loading';
  passwordError = false;

  ngOnInit() {
    this.user = this.us.getUser();
    this.roomId = this.route.snapshot.paramMap.get('id') ?? "";
    console.log("Room id", this.roomId);
    this.route.paramMap.subscribe(param => console.log("Parma", param));
    this.state = 'loading';
    this.route.paramMap
    .pipe(
      map(params => params.get('id')),
      filter(Boolean),
      distinctUntilChanged(),
      switchMap(roomId => {
        this.roomId = roomId;
        return this.roomService.isRoomPasswordProtected(roomId);
      }),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe(res => {
      console.log("Res", res);
      if (res) {
        this.state = 'password';
      }
      else {
        this.state = 'ready';
        this.onPasswordSubmit();
      }
      // this.roomId = res.data.roomId;
      // this.editorDetails = res.data;
      // console.log("Editor details", this.editorDetails);
    })
    // this.roomService.isRoomPasswordProtected(this.roomId)
    // .pipe(
    //   takeUntilDestroyed(this.destroyRef),
    //   switchMap(isPasswordProtected => {
    //     const password = isPasswordProtected ? prompt("Enter password") : "";
    //     const payload = {
    //       roomId: this.roomId,
    //       password,
    //       userId: this.user?.userId
    //     }

    //     return this.roomService.getRoomById(payload);
    //   })
    // )
    // .subscribe((d: any) => {
    //   this.editorDetails = d.data;
    // })
  }

  private loadRoom(roomId: string) {
    this.roomId = '';
    return this.roomService.isRoomPasswordProtected(roomId).pipe(
      switchMap(isProtected => {
        if (!isProtected) {
          return this.fetchRoom(roomId);
        }
        const password = this.askForPassword();
        return this.fetchRoom(roomId, password);
      })
    );
  }

  private handlePasswordProtectedRoom(roomId: string) {
    const password = this.askForPassword();
    return this.fetchRoom(roomId, password);
  }

  private fetchRoom(roomId: string, password?: string) {
    return this.roomService.getRoomById({
      roomId,
      password,
      userId: this.user?.userId
    });
  }

  private askForPassword(): string {
    const password = prompt("Enter Password") ?? "";
    if (!password) return this.askForPassword();
    return password;
  }

  onPasswordSubmit(password?: string) {
    this.state = 'loading';
    this.fetchRoom(this.roomId, password).subscribe({
      next: res => {
        this.editorDetails = res.data;
        this.roomId = res.data.roomId;
        this.state = 'ready';
      },
      error: err => {
        if (err.status === 400) {
          this.router.navigate(['/editor']);
          return;
        }
        this.state = 'password';
      }
    });
  }

  copyRoomLink() {
    const currentUrl = window.location.href;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        this.toast.success('Room link copied to clipboard!', 'Share');
      }).catch(() => {
        this.fallbackCopyToClipboard(currentUrl);
      });
    } else {
      this.fallbackCopyToClipboard(currentUrl);
    }
  }

  private fallbackCopyToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.toast.success('Room link copied to clipboard!', 'Share');
      } else {
        this.toast.error('Failed to copy link', 'Share');
      }
    } catch (err) {
      this.toast.error('Failed to copy link', 'Share');
    }

    document.body.removeChild(textArea);
  }
}
