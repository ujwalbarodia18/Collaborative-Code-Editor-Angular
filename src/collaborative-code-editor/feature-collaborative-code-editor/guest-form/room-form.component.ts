import { Component, DestroyRef, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { TextInputComponent } from "../../form-components/text-input/text-input.component";
import { UiButtonComponent } from '../../form-components/ui-button/ui-button.component';
import { Store } from '@ngxs/store';
import { RoomActions } from '../../data-collaborative-code-editor/states/room/room.action';
import { Router } from '@angular/router';
import { UserService } from '../../data-collaborative-code-editor/services/user.service';
import { filter, Observable, take } from 'rxjs';
import { RoomState } from '../../data-collaborative-code-editor/states/room/room.state';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-room-form',
  imports: [TextInputComponent, ɵInternalFormsSharedModule, ReactiveFormsModule, UiButtonComponent, AsyncPipe],
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.scss',
})
export class RoomFormComponent {
  @Input() formType?: 'join' | 'host';
  @Output() submitForm = new EventEmitter<void>();
  joinForm!: FormGroup;
  hostForm!: FormGroup;
  roomId!: FormControl;
  submitted: boolean = false;

  showCreateRoomLoader$!: Observable<boolean>;
  lastGeneratedRoomId$!: Observable<string>;

  constructor(private fb: FormBuilder, private store: Store, private router: Router, private us: UserService, private destroyRef: DestroyRef) {}

  ngOnInit() {
    this.joinForm = this.fb.group({
      roomId: this.fb.control('', Validators.required)
    });

    this.hostForm = this.fb.group({
      roomName: this.fb.control(''),
      password: this.fb.control('')
    })

    this.setStateSelection();
    this.setStateSubscription();
  }

  setStateSelection() {
    this.showCreateRoomLoader$ = this.store.select(RoomState.getShowCreateRoomLoader);
    this.lastGeneratedRoomId$ = this.store.select(RoomState.getLastGeneratedRoomId);
  }

  setStateSubscription() {
    this.lastGeneratedRoomId$
    .pipe(filter(Boolean), take(1), takeUntilDestroyed(this.destroyRef))
    .subscribe(roomId => {
      this.navigateToRoom(roomId);
    })
  }

  createUser(name: string) {
    this.us.createGuestUser(name);
  }

  openJoinRoomForm() {
    this.submitted = false;
    this.formType = 'join';
  }

  openHostRoomForm() {
    this.submitted = false;
    this.formType = 'host';
  }

  navigateToRoom(id: string) {
    if (!id) return;
    this.submitForm.emit();
    this.router.navigate([`/editor/${id}`]);
  }

  handleHostRoom() {
    this.submitted = true;
    if (this.hostForm.invalid) {
      this.hostForm.markAllAsTouched();
      return;
    }
    const hostFormValue = this.hostForm.getRawValue();
    const { roomName, password } = hostFormValue;
    const roomDetails = {
      roomName,
      password
    }
    this.store.dispatch(new RoomActions.CreateRoom(roomDetails));
  }

  handleJoinRoom() {
    this.submitted = true;
    if (this.joinForm.invalid) {
      this.joinForm.markAllAsTouched();
      return;
    }
    const joinFormValue = this.joinForm.getRawValue();
    const roomId = joinFormValue.roomId;
    // this.createUser(joinFormValue.displayName);
    this.navigateToRoom(roomId);
  }
}
