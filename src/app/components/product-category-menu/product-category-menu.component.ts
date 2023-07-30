import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css'],
})
export class ProductCategoryMenuComponent implements OnInit {

  public productCategories: ProductCategory[] = [];

  constructor(private readonly productService: ProductService) { }

  public ngOnInit(): void {
    this.listProductCategories();
  }

  private listProductCategories(): void {
    this.productService.getProductCategories().subscribe((data) => this.productCategories = data)
  }
}
