import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ProductsService } from 'src/app/services/products.service';
import { SuppliersService } from 'src/app/services/suppliers.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SharedModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loading: boolean = false;

  dataGraphAmountByType: any;
  optionsGraphAmountByType: any;

  dataGraphValuesByType: any;
  optionsGraphValuesByType: any;

  dataGraphProductsValues: any;
  optionsGraphProductsValues: any;

  optionsGraphAmountByStates: any;
  dataGraphAmountByStates: any;

  dataGraphAmountByCategory: any;
  optionsGraphAmountByCategory: any;

  dataGraphAmountByProduct: any;
  optionsGraphAmountByProduct: any;

  authService = inject(AuthService);
  productService = inject(ProductsService);
  supplierstService = inject(SuppliersService);

  ngOnInit(): void {
    this.generateGraphAmountByType();
    this.generateGraphValuesByType();
    this.generateGraphProductsValues();
    this.generateGraphAmountByStates();
    this.generateGraphAmountByCategory();
    this.generateGraphAmountByProduct();
  }

  generateGraphAmountByType() {
    this.loading = true;
    this.productService.getGraphAmountByType().subscribe((res) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      const labels = res.map((item: { typeName: string }) => item.typeName);
      const data = res.map((item: { amount: number }) => item.amount);

      this.dataGraphAmountByType = {
        labels: labels,
        datasets: [
          {
            label: 'Quantidade em estoque',
            data: data,
            backgroundColor: [
              '#6767ff',
              '#eb5f5f',
              '#9fec88',
              '#3f0808',
              '#63b8be',
              '#da82ce',
              '#f3e17b',
            ],
            borderColor: [
              '#6767ff',
              '#eb5f5f',
              '#9fec88',
              '#3f0808',
              '#63b8be',
              '#da82ce',
              '#f3e17b',
            ],
            borderWidth: 1,
          },
        ],
      };

      this.optionsGraphAmountByType = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };
      this.loading = false;
    });
  }

  generateGraphValuesByType() {
    this.loading = true;
    this.productService.getGraphValuesByType().subscribe((res) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      const labels = res.map((item: { typeName: string }) => item.typeName);
      const data = res.map((item: { value: number }) => item.value);

      this.dataGraphValuesByType = {
        labels: labels,
        datasets: [
          {
            label: 'Valor (R$) em estoque',
            data: data,
            backgroundColor: [
              '#6767ff',
              '#eb5f5f',
              '#9fec88',
              '#3f0808',
              '#63b8be',
              '#da82ce',
              '#f3e17b',
            ],
            borderColor: [
              '#6767ff',
              '#eb5f5f',
              '#9fec88',
              '#3f0808',
              '#63b8be',
              '#da82ce',
              '#f3e17b',
            ],
            borderWidth: 1,
          },
        ],
      };

      this.optionsGraphValuesByType = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };
      this.loading = false;
    });
  }

  generateGraphProductsValues() {
    this.loading = true;
    this.productService.getGraphProductsValues().subscribe((res) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      const labels = res.map(
        (item: { productName: string }) => item.productName
      );
      const data = res.map((item: { value: number }) => item.value);

      this.dataGraphProductsValues = {
        labels: labels,
        datasets: [
          {
            label: 'Valor (R$) em estoque',
            backgroundColor: [
              '#6767ff',
              '#eb5f5f',
              '#9fec88',
              '#3f0808',
              '#63b8be',
              '#da82ce',
              '#f3e17b',
            ],
            borderColor: [
              '#6767ff',
              '#eb5f5f',
              '#9fec88',
              '#3f0808',
              '#63b8be',
              '#da82ce',
              '#f3e17b',
            ],
            data: data,
            borderWidth: 1,
          },
        ],
      };

      this.optionsGraphProductsValues = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };
      this.loading = false;
    });
  }

  generateGraphAmountByStates() {
    this.loading = true;
    this.supplierstService.getGraphAmountByStates().subscribe((res) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      const labels = res.map((item: { state: string }) => item.state);
      const data = res.map((item: { amount: number }) => item.amount);

      this.dataGraphAmountByStates = {
        labels: labels,
        datasets: [
          {
            label: 'Fornecedores por Estado',
            data: data,
            backgroundColor: [
              '#6767ff',
              '#eb5f5f',
              '#9fec88',
              '#3f0808',
              '#63b8be',
              '#da82ce',
              '#f3e17b',
            ],
            borderColor: [
              '#6767ff',
              '#eb5f5f',
              '#9fec88',
              '#3f0808',
              '#63b8be',
              '#da82ce',
              '#f3e17b',
            ],
            borderWidth: 1,
          },
        ],
      };

      this.optionsGraphAmountByStates = {
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        cutout: '80%',
      };
      this.loading = false;
    });
  }

  generateGraphAmountByCategory() {
    this.loading = true;
    this.supplierstService.getGraphAmountByCategory().subscribe((res) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      const labels = res.map((item: { category: string }) => item.category);
      const data = res.map((item: { amount: number }) => item.amount);

      this.dataGraphAmountByCategory = {
        labels: labels,
        datasets: [
          {
            label: 'Quantidade da Categoria',
            data: data,
            backgroundColor: [
              '#6767ff',
              '#eb5f5f',
              '#9fec88',
              '#3f0808',
              '#63b8be',
              '#da82ce',
              '#f3e17b',
            ],
            borderColor: [
              '#6767ff',
              '#eb5f5f',
              '#9fec88',
              '#3f0808',
              '#63b8be',
              '#da82ce',
              '#f3e17b',
            ],
            borderWidth: 1,
          },
        ],
      };

      this.optionsGraphAmountByCategory = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };
      this.loading = false;
    });
  }

  generateGraphAmountByProduct() {
    this.loading = true;
    this.supplierstService.getGraphAmountByProducts().subscribe((res) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      const labels = res.map(
        (item: { nameSupplier: string }) => item.nameSupplier
      );
      const data = res.map(
        (item: { amountProducts: number }) => item.amountProducts
      );
      this.dataGraphAmountByProduct = {
        labels: labels,
        datasets: [
          {
            label: 'Quantidade Fornecida',
            data: data,
            backgroundColor: [
              '#6767ff',
              '#eb5f5f',
              '#9fec88',
              '#3f0808',
              '#63b8be',
              '#da82ce',
              '#f3e17b',
            ],
            borderColor: [
              '#6767ff',
              '#eb5f5f',
              '#9fec88',
              '#3f0808',
              '#63b8be',
              '#da82ce',
              '#f3e17b',
            ],
            borderWidth: 1,
          },
        ],
      };

      this.optionsGraphAmountByProduct = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };
      this.loading = false;
    });
  }
}
