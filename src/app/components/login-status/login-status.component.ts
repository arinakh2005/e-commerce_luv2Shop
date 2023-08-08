import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css'],
})
export class LoginStatusComponent implements OnInit {

  public isAuthenticated = false;
  public userFullName = '';

  private storage: Storage = sessionStorage;

  constructor(
    @Inject(OKTA_AUTH)
    private readonly oktaAuth: OktaAuth,
    private readonly oktaAuthStateService: OktaAuthStateService,
  ) { }

  public ngOnInit(): void {
    this.oktaAuthStateService.authState$.subscribe((result) => {
      this.isAuthenticated = result.isAuthenticated!;
      this.getUserDetails();
    });
  }

  public logout(): void {
    this.oktaAuth.signOut();
  }

  private getUserDetails(): void {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then((res) => {
        this.userFullName = res.name as string;

        const theEmail = res.email;

        this.storage.setItem('userEmail', JSON.stringify(theEmail));
      });
    }
  }
}
