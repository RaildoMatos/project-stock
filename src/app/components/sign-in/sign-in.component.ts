import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SignInComponent implements OnInit {
  authService = inject(AuthService);

  ngOnInit(): void {}
}
