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

  dataGraphProductsValues: any;
  optionsGraphProductsValues: any;

  optionsGraphAmountByStates: any;
  dataGraphAmountByStates: any;

  dataGraphAmountByCategory: any;
  optionsGraphAmountByCategory: any;

  dataGraphAmountByProduct: any;
  optionsGraphAmountByProduct: any;

  ngOnInit(): void {
    this.generateGraphAmountByType();
    this.generateGraphValuesByType();
    this.generateGraphProductsValues();
    this.generateGraphAmountByStates();
    this.generateGraphAmountByCategory();
    this.generateGraphAmountByProduct();
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

  generateGraphProductsValues() {
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
            backgroundColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
            borderColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
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
    });
  }
  generateGraphAmountByStates() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dataGraphAmountByStates = {
      labels: ['Quantidade por Estado'],
      datasets: [
        {
          data: '/amount-state',
          backgroundColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
          borderColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
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
  }
  generateGraphAmountByCategory() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dataGraphAmountByCategory = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
          borderColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
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
  }
  generateGraphAmountByProduct() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.dataGraphAmountByProduct = {
      labels: [],
      datasets: [
        {
          label: 'Quantidade de Produto por Fornecedor',
          backgroundColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
          borderColor: ['#9933ff', '#0066ff', '#cc99cc', '#99cc66'],
          data: [65, 59, 80, 81, 56, 55, 40],
        },
      ],
    };

    this.optionsGraphAmountByProduct = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
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
  }
}
