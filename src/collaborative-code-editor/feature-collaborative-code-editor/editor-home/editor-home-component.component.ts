import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../data-collaborative-code-editor/services/user.service';
import { User } from '../../common/models/user';
import { UiSidebarComponent } from "../../ui-components/ui-sidebar/ui-sidebar.component";

@Component({
  selector: 'app-editor-home-component',
  standalone: true,
  imports: [RouterOutlet, UiSidebarComponent],
  templateUrl: './editor-home-component.component.html',
  styleUrls: ['./editor-home-component.component.scss'],
})
export class EditorHomeComponentComponent {
  constructor (private us: UserService, private router: Router) {}

  user?: User;
  isGuestLogin: boolean = true;

  ngOnInit() {
    if (this.isGuestLogin) {
      const user = this.us.getUser();
      if (user) {
        this.user = user;
      }
      else {
        this.router.navigate(['/editor']);
      }
    }
  }
}
