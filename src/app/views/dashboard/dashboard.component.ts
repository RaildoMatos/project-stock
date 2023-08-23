import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SharedModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  productService = inject(ProductsService);

  dataGraphAmountByType: any;
  optionsGraphAmountByType: any;

  dataGraphValuesByType: any;
  optionsGraphValuesByType: any;

  optionsGraphProductsValues: any;
  dataGraphProductsValues: any;

  ngOnInit(): void {
    this.generateGraphAmountByType();
    this.generateGraphValuesByType();
    this.generateGraphProductsValues();
  }
  generateGraphProductsValues() {
    this.productService.getGraphProductsValues().subscribe((res) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      this.dataGraphProductsValues = {
        labels: res.map((item: { productName: string }) => item.productName),
        datasets: [
          {
            label: 'Valor Total',
            backgroundColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
            borderColor: [
              textColor,
              'rgba(255,255,255,0.8)',
              'rgba(255,255,255,0.8)',
              'rgba(255,255,255,0.8)',
            ],
            data: res.map((item: { value: number }) => item.value), // Usando os valores do objeto como dados
            hoverBackgroundColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
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
    });
  }

  generateGraphAmountByType() {
    this.productService.getGraphAmountByType().subscribe((res) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      this.dataGraphAmountByType = {
        labels: res.map((item: { typeName: string }) => item.typeName),
        datasets: [
          {
            label: 'Quantidade em estoque',
            data: res.map((item: { amount: number }) => item.amount),
            backgroundColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
            hoverBackgroundColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
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
    });
  }

  generateGraphValuesByType() {
    this.productService.getGraphValuesByType().subscribe((response) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--text-color-secondary'
      );
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      const data = Object.values(response).map((item: any) => item.value);
      const labels = Object.values(response).map((item: any) => item.typeName);

      this.dataGraphValuesByType = {
        labels: labels,
        datasets: [
          {
            label: 'Valor (R$) em estoque',
            data: data,
            backgroundColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],

            borderColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
            borderWidth: 1,
          },
        ],
      };

      this.optionsGraphValuesByType = {
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
        },
      };
    });
  }
}
