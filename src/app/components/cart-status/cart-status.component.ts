import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css'],
})
export class CartStatusComponent implements OnInit {

  public totalPrice = 0;
  public totalQuantity = 0;

  constructor(private readonly cartService: CartService) { }

  public ngOnInit(): void {
    this.updateCartStatus();
  }

  private updateCartStatus(): void {
    this.cartService.totalPrice.subscribe((data) => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe((data) => this.totalQuantity = data);
  }
}
