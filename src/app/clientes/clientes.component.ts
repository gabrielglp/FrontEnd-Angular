import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  isModalVisible = false;
  selectedCliente: any = null;
  clientes: any[] = [];
  searchTerm: string = '';
  searchCompleted = false;
  router: any;

  constructor(private authService: AuthService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.authService.getClientes().subscribe(
      (data) => {
        this.clientes = data;
        this.searchCompleted = true;
      },
    );
  }

  searchClientes(): void {
    if (this.searchTerm.trim() === '') {
      this.loadClientes();
      return;
    }

    const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const isCpf = cpfPattern.test(this.searchTerm);

    if (isCpf) {
      this.authService.searchClientes(this.searchTerm, '').subscribe(
        (data: any[]) => {
          this.clientes = data;
          this.searchCompleted = true;
        },
        (error: any) => {
          this.clientes = [];
          this.searchCompleted = true;
        }
      );
    } else {
      this.authService.searchClientes('', this.searchTerm).subscribe(
        (data: any[]) => {
          this.clientes = data;
          this.searchCompleted = true;
        },
        (error: any) => {
          this.clientes = [];
          this.searchCompleted = true;
        }
      );
    }
  }

  openModal(cliente: any = null): void {
    this.selectedCliente = cliente;
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedCliente = null;
  }

  handleModalSubmit(cliente: any): void {
    if (cliente.clienteId) {
      this.authService.updateCliente(cliente.clienteId, cliente).subscribe(
        () => {
          this.loadClientes();
          this.closeModal();
        }
      );
    } else {
      this.authService.createCliente(cliente).subscribe(
        () => {
          this.loadClientes();
          this.closeModal();
        }
      );
    }
  }

  deleteCliente(id: number): void {
    this.authService.deleteCliente(id).subscribe(
      () => {
        this.loadClientes();
        this.toastr.success('Usuario excluido!')
      }
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
