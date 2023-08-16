import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DividerModule,
    ButtonModule,
    CardModule,
    InputTextModule,
  ],
})
export class SignInComponent implements OnInit {
  authService = inject(AuthService);

  ngOnInit(): void {}
}
