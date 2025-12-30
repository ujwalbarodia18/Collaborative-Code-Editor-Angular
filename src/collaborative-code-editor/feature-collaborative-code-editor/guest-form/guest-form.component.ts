import { UiDialogComponent } from './../../ui-components/ui-dialog/ui-dialog.component';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { TextInputComponent } from "../../form-components/text-input/text-input.component";
import { UiButtonComponent } from '../../form-components/ui-button/ui-button.component';
import { ApiService } from '../../data-collaborative-code-editor/services/api.service';
import { Store } from '@ngxs/store';
import { RoomActions } from '../../data-collaborative-code-editor/states/room/room.action';
import { RoomService } from '../../data-collaborative-code-editor/services/room.service';
import { Router } from '@angular/router';
import { UserService } from '../../data-collaborative-code-editor/services/user.service';

@Component({
  selector: 'app-guest-form',
  imports: [TextInputComponent, ɵInternalFormsSharedModule, ReactiveFormsModule, UiButtonComponent],
  templateUrl: './guest-form.component.html',
  styleUrl: './guest-form.component.scss',
})
export class GuestFormComponent {
  joinForm!: FormGroup;
  hostForm!: FormGroup;
  roomId!: FormControl;
  formType?: 'join' | 'host';
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private roomService: RoomService, private router: Router, private us: UserService) {}

  ngOnInit() {
    this.joinForm = this.fb.group({
      displayName: this.fb.control('', Validators.required),
      roomId: this.fb.control('', Validators.required)
    });

    this.hostForm = this.fb.group({
      displayName: this.fb.control('', Validators.required),
      roomName: this.fb.control('')
    })
  }

  createUser(name: string) {
    this.us.createGuestUser(name);
  }

  openJoinRoomForm() {
    this.submitted = false;
    this.formType = 'join';
    console.log("JOin form", this.joinForm);
  }

  openHostRoomForm() {
    this.submitted = false;
    this.formType = 'host';
  }

  navigateToRoom(id: string) {
    if (!id) return;
    this.router.navigate([`/editor/${id}`]);
  }

  handleHostRoom() {
    this.submitted = true;

    if (this.hostForm.invalid) {
      this.hostForm.markAllAsTouched();
      return;
    }
    const hostFormValue = this.hostForm.getRawValue();
    this.roomService.generateRoom().subscribe((data) => {
      this.createUser(hostFormValue.displayName);
      this.navigateToRoom(data);
    })
  }

  handleJoinRoom() {
    this.submitted = true;
    if (this.joinForm.invalid) {
      this.joinForm.markAllAsTouched();
      console.log("Join form", this.joinForm);
      return;
    }
    const joinFormValue = this.joinForm.getRawValue();
    const roomId = joinFormValue.roomId;
    this.createUser(joinFormValue.displayName);
    this.navigateToRoom(roomId);
  }
}
