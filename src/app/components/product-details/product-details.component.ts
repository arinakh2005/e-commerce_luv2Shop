import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {

  public product!: Product;

  constructor(
    private readonly productService: ProductService,
    private readonly route: ActivatedRoute,
  ) { }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  public handleProductDetails(): void {
   const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

   this.productService.getProduct(theProductId).subscribe((data) => {
     this.product = data;
   });
  }

}
