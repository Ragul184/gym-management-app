import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private authService: AuthService, private router: Router) { }

  async logout() {
    await this.authService.logOut();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

}
