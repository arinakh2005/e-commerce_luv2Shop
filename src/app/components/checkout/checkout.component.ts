import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Luv2ShopValidators } from '../../validators/luv2-shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { environment } from '../../../environments/environment';
import { PaymentInfo } from '../../common/payment-info';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {

  public checkoutFormGroup!: FormGroup;
  public totalPrice = 0;
  public totalQuantity = 0;
  public creditCardMonths: number[] = [];
  public countries: Country[] = [];
  public shippingAddressStates: State[] = [];
  public billingAddressStates: State[] = [];
  public stripe = Stripe(environment.stripePublishableKey);
  public paymentInfo: PaymentInfo = new PaymentInfo();
  public cardElement: any;
  public displayError: any = '';
  public isDisabled = false;

  private storage: Storage = sessionStorage;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly luv2ShopFormService: Luv2ShopFormService,
    private readonly cartService: CartService,
    private readonly checkoutService: CheckoutService,
    private readonly router: Router,
  ) { }

  public get firstName(): AbstractControl | null {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  public get lastName(): AbstractControl | null {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  public get email(): AbstractControl | null {
    return this.checkoutFormGroup.get('customer.email');
  }

  public get shippingAddressStreet(): AbstractControl | null {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  public get shippingAddressCity(): AbstractControl | null {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  public get shippingAddressState(): AbstractControl | null {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  public get shippingAddressZipCode(): AbstractControl | null {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  public get shippingAddressCountry(): AbstractControl | null {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  public get billingAddressStreet(): AbstractControl | null {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  public get billingAddressCity(): AbstractControl | null {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  public get billingAddressState(): AbstractControl | null {
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  public get billingAddressZipCode(): AbstractControl | null {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  public get billingAddressCountry(): AbstractControl | null {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  public ngOnInit(): void {
    this.setupStripePaymentForm();
    this.reviewCartDetails();

    const emailStorageData = this.storage.getItem('userEmail');
    const theEmail = JSON.parse(emailStorageData || '');

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhiteSpace,
          ],
        ),
        lastName: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhiteSpace,
          ],
        ),
        email: new FormControl(theEmail,
          [
            Validators.required,
            Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhiteSpace,
          ],
        ),
        city: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhiteSpace,
          ],
        ),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhiteSpace,
          ],
        ),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhiteSpace,
          ],
        ),
        city: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhiteSpace,
          ],
        ),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhiteSpace,
          ],
        ),
      }),
      creditCard: this.formBuilder.group({ }),
    });
    this.luv2ShopFormService.getCountries().subscribe((data) =>
      this.countries = data,
    );
  }

  public onSubmit(): void {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();

      return;
    }

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cardItems = this.cartService.cartItems;
    const orderItems: OrderItem[] = cardItems.map((cartItem) => new OrderItem(cartItem));
    let purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;

    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress?.state || ''));
    const shippingCountry: State = JSON.parse(JSON.stringify(purchase.shippingAddress?.country || ''));
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress?.state || ''));
    const billingCountry: State = JSON.parse(JSON.stringify(purchase.billingAddress?.country || ''));

    if (purchase.shippingAddress) {
      purchase.shippingAddress.state = shippingState.name;
      purchase.shippingAddress.country = shippingCountry.name;
    }

    if (purchase.billingAddress) {
      purchase.billingAddress.state = billingState.name;
      purchase.billingAddress.country = billingCountry.name;
    }

    purchase.order = order;
    purchase.orderItems = orderItems;

    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = 'USD';
    this.paymentInfo.receiptEmail = purchase.customer?.email;

    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === '') {
      this.isDisabled = true;
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe((paymentInfoResponse) => {
        this.stripe.confirmCardPayment(paymentInfoResponse.client_secret, {
          payment_method: {
            card: this.cardElement,
            billing_details: {
              email: purchase.customer?.email,
              name: `${purchase.customer?.firstName} ${purchase.customer?.lastName}`,
              address: {
                line1: purchase.billingAddress?.street,
                city: purchase.billingAddress?.city,
                state: purchase.billingAddress?.state,
                postal_code: purchase.billingAddress?.zipCode,
                country: this.billingAddressCountry?.value.code,
              },
            },
          },
        }, { handleActions: false })
          .then((result: any) => {
            if (result.error) {
              alert(`There was an error: ${result.error.message}`);
              this.isDisabled = false;
            } else {
              this.checkoutService.placeOrder(purchase).subscribe({
                next: (response: any) => {
                  alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
                  this.resetCart();
                  this.isDisabled = false;
                },
                error: (error: any) => {
                  alert(`There was an error: ${error.error.message}`);
                  this.isDisabled = false;
                },
              });
            }
          });
      });
    } else {
      this.checkoutFormGroup.markAllAsTouched();

      return;
    }
  }

  public copyShippingAddressToBillingAddress(isChecked: boolean): void {
    if (isChecked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  public handleMonthsAndYears(): void {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear = new Date().getFullYear();
    const selectedYear = Number(creditCardFormGroup?.value.expirationYear);
    const isCurrentYearSelected = currentYear === selectedYear;
    const startMonth = isCurrentYearSelected
      ? new Date().getMonth() + 1
      : 1;

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe((data) =>
      this.creditCardMonths = data,
    );
  }

  public getStates(formGroupName: string): void {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    this.luv2ShopFormService.getStates(countryCode).subscribe((data) => {
      const isShippingAddressGroup = formGroupName === 'shippingAddress';

      isShippingAddressGroup
        ? this.shippingAddressStates = data
        : this.billingAddressStates = data;

      formGroup?.get('state')?.setValue(data[0]);
    });
  }

  public isControlInvalid(controlName: string): boolean {
    const control = this.checkoutFormGroup.get(controlName);
    const isControlInvalid = control?.invalid;
    const isControlTouched = control?.dirty || control?.touched;

    return (isControlInvalid && isControlTouched) || false;
  }

  private reviewCartDetails(): void {
    this.cartService.totalQuantity.subscribe((totalQuantity) =>
      this.totalQuantity = totalQuantity,
    );
    this.cartService.totalPrice.subscribe((totalPrice) =>
      this.totalPrice = totalPrice,
    );
  }

  private resetCart(): void {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl('/products');
  }

  private setupStripePaymentForm(): void {
    const elements = this.stripe.elements();

    this.cardElement = elements.create('card', { hidePostalCode: true });
    this.cardElement.mount('#card-element');
    this.cardElement.on('change', (event: any) => {
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = '';
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    });
  }
}
