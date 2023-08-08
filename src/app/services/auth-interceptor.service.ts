import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    @Inject(OKTA_AUTH)
    private readonly oktaAuth: OktaAuth,
  ) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let interceptedRequest = request;

    const securedEndpoints = ['http://localhost:8080/api/orders'];
    const accessToken = 'Bearer ' + this.oktaAuth.getAccessToken();

    securedEndpoints.some((url) => {
      const isSecuredEndpoint = request.urlWithParams.includes(url);

      if (!isSecuredEndpoint) return;

      interceptedRequest = request.clone({
        headers: request.headers
          .set('Authorization', accessToken)
          .set('Content-Type', 'application/json'),
      });
    });

    return next.handle(interceptedRequest);
  }
}
