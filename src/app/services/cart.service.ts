import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable()
export class CartService {
  public cartItems: CartItem[] = [];
  public totalPrice: Subject<number> = new Subject<number>();
  public totalQuantity: Subject<number> = new Subject<number>();

  public addToCart(theCartItem: CartItem): void {
    let isAlreadyExistInCart = false;
    let existingCartItem: CartItem | undefined = undefined;

    if (this.cartItems.length) {
      existingCartItem = this.cartItems.find((tempCartItem) => tempCartItem.id === theCartItem.id);

      isAlreadyExistInCart = existingCartItem !== undefined;
    }

    isAlreadyExistInCart
      ? existingCartItem!.quantity++
      : this.cartItems.push(theCartItem);

    this.computeCartTotals();
  }

  public computeCartTotals(): void {
    let totalPriceValue = 0;
    let totalQuantityValue = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }

  public decrementQuantity(theCartItem: CartItem): void {
    theCartItem.quantity--;

    !theCartItem.quantity
      ? this.remove(theCartItem)
      : this.computeCartTotals();
  }

  public remove(theCartItem: CartItem): void {
    const itemIndex= this.cartItems.findIndex((tempCartItem) =>
      tempCartItem.id === theCartItem.id,
    );

    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}
