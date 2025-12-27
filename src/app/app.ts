import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EditorComponent } from '../collaborative-code-editor/ui-components/editor/editor.component';
import { LandingPageComponentComponent } from "../collaborative-code-editor/feature-collaborative-code-editor/landing-page/landing-page-component.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
