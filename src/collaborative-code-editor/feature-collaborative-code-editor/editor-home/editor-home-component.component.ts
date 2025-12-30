import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../data-collaborative-code-editor/services/user.service';
import { User } from '../../common/models/user';

@Component({
  selector: 'app-editor-home-component',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './editor-home-component.component.html',
  styleUrls: ['./editor-home-component.component.scss'],
})
export class EditorHomeComponentComponent {
  constructor (private us: UserService, private router: Router) {}

  user?: User;
  isGuestLogin: boolean = true;

  ngOnInit() {
    if (this.isGuestLogin) {
      const user = this.us.getGuestUser();
      if (user) {
        this.user = user;
      }
      else {
        this.router.navigate(['/']);
      }
    }
  }
}
