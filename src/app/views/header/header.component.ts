import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TabMenuModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
    items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            { label: 'Inicio', icon: 'pi pi-fw pi-home' },
            { label: 'Fornecedores', icon: 'pi pi-fw pi-calendar' },
            { label: 'Marcas', icon: 'pi pi-fw pi-pencil' },
            { label: 'Produtos', icon: 'pi pi-fw pi-file' },
            { label: 'Login', icon: 'pi pi-fw pi-cog' }
        ];
    }
}


