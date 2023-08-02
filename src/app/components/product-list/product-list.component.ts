import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {

  public products: Product[] = [];
  public currentCategoryId = 1;
  public currentCategoryName = "";
  public searchMode = false;

  constructor(
    private readonly productService: ProductService,
    private readonly activatedRoute: ActivatedRoute,
  ) { }

  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  private listProducts(): void {
    this.searchMode = this.activatedRoute.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  private handleListProducts(): void {
    const hasCategoryId = this.activatedRoute.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.activatedRoute.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.activatedRoute.snapshot.paramMap.get('name')!;
    } else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    this.productService.getProductList(this.currentCategoryId).subscribe((data) => this.products = data);
  }

  private handleSearchProducts(): void {
    const theKeyword = this.activatedRoute.snapshot.paramMap.get('keyword')!;

    this.productService.searchProducts(theKeyword)
      .subscribe((data) => this.products = data);
  }
}
