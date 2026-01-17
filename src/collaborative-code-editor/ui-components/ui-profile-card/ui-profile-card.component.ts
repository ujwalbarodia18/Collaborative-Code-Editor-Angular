import { Component } from '@angular/core';
import { UserService } from '../../data-collaborative-code-editor/services/user.service';
import { User } from '../../common/models/user';
import { AuthService } from '../../auth/auth.service';
import { TooltipDirective } from '../../common/directives/tooltip-directive.directive';

@Component({
  selector: 'ui-profile-card',
  imports: [TooltipDirective],
  templateUrl: './ui-profile-card.component.html',
  styleUrl: './ui-profile-card.component.scss',
  standalone: true
})
export class UiProfileCardComponent {
  user?: User;

  constructor(private us: UserService, private auth: AuthService) {}

  ngOnInit() {
    this.user = this.us.getUser();
  }

  handleLogout() {
    this.auth.logout();
  }
}
