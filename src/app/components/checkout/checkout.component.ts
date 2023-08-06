import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Luv2ShopValidators } from '../../validators/luv2-shop-validators';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {

  public checkoutFormGroup!: FormGroup;
  public totalPrice = 0;
  public totalQuantity = 0;
  public creditCardYears: number[] = [];
  public creditCardMonths: number[] = [];
  public countries: Country[] = [];
  public shippingAddressStates: State[] = [];
  public billingAddressStates: State[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly luv2ShopFormService: Luv2ShopFormService,
    private readonly cartService: CartService,
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

  public get creditCardType(): AbstractControl | null {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  public get creditCardNameOnCard(): AbstractControl | null {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  public get creditCardNumber(): AbstractControl | null {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  public get creditCardSecurityCode(): AbstractControl | null {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  public ngOnInit(): void {
    this.reviewCartDetails();
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
        email: new FormControl('',
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
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('',
          [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhiteSpace,
          ],
        ),
        cardNumber: new FormControl('',
          [
            Validators.required,
            Validators.pattern('[0-9]{16}'),
          ],
        ),
        securityCode: new FormControl('',
          [
            Validators.required,
            Validators.pattern('[0-9]{3}'),
          ],
        ),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    const startMonth = new Date().getMonth() + 1;

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe((data) =>
      this.creditCardMonths = data,
    );
    this.luv2ShopFormService.getCreditCardYears().subscribe((data) =>
      this.creditCardYears = data,
    );
    this.luv2ShopFormService.getCountries().subscribe((data) =>
      this.countries = data,
    );
  }

  public onSubmit(): void {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
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
}
