import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
})
export class CartDetailsComponent implements OnInit {

  public cartItems: CartItem[] = [];
  public totalPrice = 0;
  public totalQuantity = 0;

  constructor(private readonly cartService: CartService) { }

  public ngOnInit(): void {
    this.listCartDetails();
  }

  public incrementQuantity(theCartItem: CartItem): void {
    this.cartService.addToCart(theCartItem);
  }

  public decrementQuantity(theCartItem: CartItem): void {
    this.cartService.decrementQuantity(theCartItem);
  }

  public remove(theCartItem: CartItem): void {
    this.cartService.remove(theCartItem);
  }

  private listCartDetails(): void {
    this.cartItems = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe((data) => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe((data) => this.totalQuantity = data);
    this.cartService.computeCartTotals();
  }
}
