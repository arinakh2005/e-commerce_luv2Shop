import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable()
export class CheckoutService {

  private readonly purchaseUrl = environment.luv2shopApiUrl + '/checkout/purchase';
  private readonly paymentIntentUrl = environment.luv2shopApiUrl + '/checkout/payment-intent';

  constructor(private readonly httpClient: HttpClient) { }

  // TODO: remove any
  public placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  public createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }
}
