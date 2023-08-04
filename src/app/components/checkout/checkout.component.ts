import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';

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
  ) { }

  public ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
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
}
