import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastr.warning('Preencha todos os campos obrigatórios corretamente.', 'Aviso');
      this.loginForm.markAllAsTouched();
    } else {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        response => {
          this.authService.setAuthToken(response.token);
          this.router.navigate(['/clientes']);
          this.toastr.success('Login efetuado com sucesso!', 'Sucesso');
        },
        error => {
          this.toastr.error('Email ou Senha incorreto.', 'Erro');
        }
      );
    }
  }
}
