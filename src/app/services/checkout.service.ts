import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class CheckoutService {

  private readonly purchaseUrl = environment.luv2shopApiUrl + '/checkout/purchase';

  constructor(private readonly httpClient: HttpClient) { }

  // TODO: remove any
  public placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
}
