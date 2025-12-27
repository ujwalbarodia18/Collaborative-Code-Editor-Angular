import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-editor-home-component',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './editor-home-component.component.html',
  styleUrls: ['./editor-home-component.component.scss'],
})
export class EditorHomeComponentComponent {}
