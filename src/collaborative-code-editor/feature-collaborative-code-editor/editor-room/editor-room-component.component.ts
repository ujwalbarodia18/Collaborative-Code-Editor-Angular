import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from "../../ui-components/editor/editor.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editor-room-component',
  standalone: true,
  imports: [CommonModule, EditorComponent],
  templateUrl: './editor-room-component.component.html',
  styleUrls: ['./editor-room-component.component.scss'],
})
export class EditorRoomComponentComponent {
  constructor(private router: ActivatedRoute) {}

  roomId: string = "";
  displayName: string = "";

  ngOnInit() {
    this.roomId = this.router.snapshot.paramMap.get('id') ?? "";
  }
}
