import { Component, OnInit } from '@angular/core';
import { GetResponseProducts, ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {

  public products: Product[] = [];
  public previousCategoryId = 1;
  public currentCategoryId = 1;
  public currentCategoryName = '';
  public searchMode = false;
  public previousKeyword = '';

  // Pagination properties
  public thePageNumber = 1;
  public thePageSize = 5;
  public theTotalElements = 0;

  constructor(
    private readonly productService: ProductService,
    private readonly activatedRoute: ActivatedRoute,
  ) { }

  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  public listProducts(): void {
    this.searchMode = this.activatedRoute.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  public updatePageSize(pageSize: string): void {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
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

    if (this.previousCategoryId !== this.currentCategoryId) this.thePageNumber = 1;

    this.previousCategoryId = this.currentCategoryId;
    this.productService.getProductListPaginate(
      this.thePageNumber - 1, this.thePageSize, this.currentCategoryId,
    ).subscribe(this.processResult());
  }

  private handleSearchProducts(): void {
    const theKeyword = this.activatedRoute.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword !== theKeyword) this.thePageNumber = 1;

    this.previousKeyword = theKeyword;
    this.productService.searchProductsPaginate(
      this.thePageNumber - 1, this.thePageSize, theKeyword,
    ).subscribe(this.processResult());
  }

  private processResult(): (data: GetResponseProducts) => void {
    return (data: GetResponseProducts) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }
}
