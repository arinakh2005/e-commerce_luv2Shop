import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import myAppConfig from '../../config/my-app-config';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  public oktaSignIn;

  constructor(
    @Inject(OKTA_AUTH)
    private readonly oktaAuth: OktaAuth,
  ) {
    this.oktaSignIn = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes,
      },
    });
  }

  // TODO: remove any
  public ngOnInit(): void {
    this.oktaSignIn.remove();
    this.oktaSignIn.renderEl(
      { el: '#okta-sign-in-widget' },
      (response: any) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();
        }
      },
      (error: any) => { throw error },
    );
  }

}
