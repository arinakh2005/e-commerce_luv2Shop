import { Component, OnInit } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { OrderHistoryService } from '../../services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {

  public orderHistoryList: OrderHistory[] = [];

  private storage: Storage = sessionStorage;

  constructor(private readonly orderHistoryService: OrderHistoryService) { }

  public ngOnInit(): void {
    this.handleOrderHistory();
  }

  private handleOrderHistory(): void {
    const emailStorageData = this.storage.getItem('userEmail');
    const theEmail = JSON.parse(emailStorageData || '');

    this.orderHistoryService.getOrderHistory(theEmail).subscribe((data) =>
      this.orderHistoryList = data._embedded.orders,
    );
  }
}
