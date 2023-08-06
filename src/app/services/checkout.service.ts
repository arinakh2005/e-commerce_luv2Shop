import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';

@Injectable()
export class CheckoutService {

  private readonly purchaseUrl = 'http://localhost:8080/api/checkout/purchase';

  constructor(private readonly httpClient: HttpClient) { }

  // TODO: remove any
  public placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
}
