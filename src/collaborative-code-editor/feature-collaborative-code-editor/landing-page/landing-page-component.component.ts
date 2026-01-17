import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../data-collaborative-code-editor/services/user.service';
import { RoomFormComponent } from '../guest-form/room-form.component';
import { AuthComponent } from "../../auth/components/auth-page-component/auth-page.component";
import { UiButtonComponent } from "../../form-components/ui-button/ui-button.component";

@Component({
  selector: 'app-landing-page-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RoomFormComponent, AuthComponent, UiButtonComponent],
  templateUrl: './landing-page-component.component.html',
  styleUrls: ['./landing-page-component.component.scss'],
})
export class LandingPageComponentComponent {
  joinForm!: FormGroup;

  codeContentUserA = '';
  codeContentUserB = '';
  isUserATyping = false;
  isUserBTyping = false;
  private typingTimeouts: any[] = [];

  private readonly snippetA = `function startCollaboration(roomId) {
  console.log("Joining room: " + roomId);
  const socket = connectTo(roomId);
  // Waiting for peer...`;

  private readonly snippetB = `

  socket.on('peer-joined', (user) => {
    console.log(user + " connected!");
    initializeEditor();
  });
}`;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private us: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    // Start the animation sequence
    this.startTypingAnimation();
  }

  ngOnDestroy(): void {
    // Clean up timeouts to prevent memory leaks if component is destroyed early
    this.typingTimeouts.forEach(clearTimeout);
  }

  private initForm(): void {
    this.joinForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      roomId: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9-]+$')]]
    });
  }

  onSubmit(): void {
    if (this.joinForm.valid) {
      const formValue = this.joinForm.getRawValue();
      const name = formValue.displayName;
      const roomId = formValue.roomId;
      this.us.createGuestUser(name);
      this.router.navigate(
        [`editor/${roomId}`]
      );
    } else {
      this.joinForm.markAllAsTouched();
    }
  }

  // --- Typing Animation Logic ---

  private startTypingAnimation() {
    // User A starts typing immediately
    this.typeWriter(this.snippetA, 'A', 50, () => {
      // After User A finishes, wait 1 second, then User B starts
      const delayMsg = setTimeout(() => {
         // User B starts typing
         this.typeWriter(this.snippetB, 'B', 50, () => {
            // Animation cycle complete. Wait 5 seconds and loop.
            const loopDelay = setTimeout(() => {
              this.resetAnimation();
              this.startTypingAnimation();
            }, 5000);
            this.typingTimeouts.push(loopDelay);
         });
      }, 1000);
      this.typingTimeouts.push(delayMsg);
    });
  }

  private typeWriter(text: string, user: 'A'|'B', speed: number, callback: () => void) {
    let i = 0;
    if (user === 'A') this.isUserATyping = true;
    if (user === 'B') this.isUserBTyping = true;

    const type = () => {
      if (i < text.length) {
        if (user === 'A') this.codeContentUserA += text.charAt(i);
        else this.codeContentUserB += text.charAt(i);

        i++;
        const timeoutId = setTimeout(type, speed + (Math.random() * 50)); // add slight randomness to speed
        this.typingTimeouts.push(timeoutId);
      } else {
        // Typing finished for this user
        if (user === 'A') this.isUserATyping = false;
        if (user === 'B') this.isUserBTyping = false;
        callback();
      }
    };
    type();
  }

  private resetAnimation() {
    this.codeContentUserA = '';
    this.codeContentUserB = '';
    this.typingTimeouts.forEach(clearTimeout);
    this.typingTimeouts = [];
  }
}
