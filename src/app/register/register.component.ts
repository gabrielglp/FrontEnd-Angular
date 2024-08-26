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
  emailExistsError = false;

  constructor(private authService: AuthService, private toastr: ToastrService) {}

  onSubmit(): void {
    this.isSubmitted = true;
    if (!this.areFieldsFilled()) return;
    if (!this.arePasswordsMatching()) return;
    if (!this.isPasswordLengthValid()) return;
    if (!this.isEmailValid()) return;

    this.registerUser();
  }

  private areFieldsFilled(): boolean {
    if (!this.userName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Todos os campos são obrigatórios.';
      return false;
    }
    return true;
  }

  private arePasswordsMatching(): boolean {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return false;
    }
    return true;
  }

  private isPasswordLengthValid(): boolean {
    if (this.password.length < 6) {
      this.errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      return false;
    }
    return true;
  }

  public isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isEmailValid(): boolean {
    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Formato de email inválido.';
      return false;
    }
    return true;
  }

  public onEmailInput(): void {
    this.emailExistsError = false;
  }

  private registerUser(): void {
    this.authService.register(this.userId, this.userName, this.email, this.password).subscribe({
      next: (response) => this.handleSuccess(response),
      error: (err) => this.handleError(err)
    });
  }

  private handleSuccess(response: any): void {
    this.successMessage = `Registro bem-sucedido! Bem-vindo, ${response.name} (${response.email})`;
    this.toastr.success('Registro bem-sucedido!', 'Sucesso');
    this.errorMessage = '';
  }

  private handleError(err: any): void {
    if (err.status === 409) {
      this.emailExistsError = true;
    } else {
      this.errorMessage = 'Ocorreu um erro ao registrar. Tente novamente.';
    }
  }
}
