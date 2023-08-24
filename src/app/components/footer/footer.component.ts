import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  isAuthenticated: boolean = false;

  authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe((authenticated) => {
      this.isAuthenticated = authenticated;
    });
  }
}
