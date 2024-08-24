import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userId = 0;
  userName = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  isSubmitted = false;

  constructor(private authService: AuthService, private toastr: ToastrService) {}

  onSubmit(): void {
    this.isSubmitted = true;

    if (!this.userName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Todos os campos são obrigatórios.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Formato de email inválido.';
      return;
    }

    this.authService.register(this.userId, this.userName, this.email, this.password).subscribe({
      next: (response) => {
        this.successMessage = `Registro bem-sucedido! Bem-vindo, ${response.name} (${response.email})`;
        this.toastr.success('Registro bem-sucedido!', 'Sucesso');
        this.errorMessage = '';
      },
      error: (err) => {
        this.toastr.error('Ocorreu um erro ao registrar. Tente novamente.', 'Erro');
        this.errorMessage = 'Ocorreu um erro ao registrar. Tente novamente.';
      }
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
