import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ViaCepService } from '../auth/via-cep.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnChanges {
onCepBlur() {
throw new Error('Method not implemented.');
}
  @Input() isVisible = false;
  @Input() cliente: any = null;
  @Output() close = new EventEmitter<any>();

  user = {
    clienteId: 0,
    name: '',
    cpf: '',
    dob: '',
    phone: '',
    cep: '',
    state: '',
    city: '',
    neighborhood: '',
    complement: ''
  };

  constructor(private viaCepService: ViaCepService, private cd: ChangeDetectorRef, private toastr: ToastrService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cliente'] && this.cliente) {
      this.user = {
        clienteId: this.cliente.clienteId,
        name: this.cliente.name,
        cpf: this.formatCpf(this.cliente.cpf, true),
        dob: this.convertDateToInputFormat(this.cliente.birthDate),
        phone: this.formatPhone(this.cliente.telephone, true),
        cep: this.cliente.cep,
        state: this.cliente.uf,
        city: this.cliente.address,
        neighborhood: this.cliente.district,
        complement: this.cliente.complement
      };
      this.populateAddressFields(this.user.cep); // Preencher campos de endereço ao editar
      this.cd.detectChanges();
    } else {
      this.resetForm();
    }
  }
  
  populateAddressFields(cep: string): void {
    this.viaCepService.getAddress(cep).subscribe(
      address => {
        if (address) {
          this.user.state = address.uf;
          this.user.city = address.localidade;
          this.user.neighborhood = address.bairro;
          this.user.complement = address.complemento;
          this.cd.detectChanges(); // Detectar mudanças após a atualização do endereço
        } else {
          this.toastr.error('Endereço não encontrado para o CEP informado.');
        }
      }
    );
  }


  formatCpf(value: string, onInit = false): string {
    value = value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})?(\d{3})?(\d{2})?/, (_match: any, p1: any, p2: string, p3: string, p4: string) => {
        return `${p1}${p2 ? '.' + p2 : ''}${p3 ? '.' + p3 : ''}${p4 ? '-' + p4 : ''}`;
      });
    }
    return value;
  }

  formatPhone(value: string, onInit = false): string {
    value = value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  }

  searchAddress(): void {
    if (this.user.cep && (this.user.cep.length === 8 || this.user.cep.length === 9)) {
      this.viaCepService.getAddress(this.user.cep).subscribe(
        data => {
          if (data) {
            this.user.state = data.uf;
            this.user.city = data.localidade;
            this.user.neighborhood = data.bairro;
            this.user.complement = data.complemento;
          } else {
            this.toastr.error('Endereço não encontrado para o CEP informado.');
          }
        }
      );
    } else {
      this.toastr.warning('CEP inválido. Por favor, insira um CEP válido.');
    }
  }

  onOverlayClick(): void {
    this.close.emit();
  }

  onCloseClick(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const formattedUser = {
        clienteId: this.user.clienteId,
        name: this.user.name,
        cpf: this.formatCpf(this.user.cpf),
        birthDate: this.convertDateToApiFormat(this.user.dob),
        telephone: this.formatPhone(this.user.phone),
        cep: this.user.cep,
        uf: this.user.state,
        address: this.user.city,
        district: this.user.neighborhood,
        complement: this.user.complement
      };

      this.close.emit(formattedUser);
      this.closeModal();
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  public isFormValid(): boolean {
    return !!(this.user.name &&
              this.user.cpf &&
              this.user.dob &&
              this.user.phone &&
              this.user.cep &&
              this.user.state &&
              this.user.city &&
              this.user.neighborhood);
  }

  private resetForm(): void {
    this.user = {
      clienteId: 0,
      name: '',
      cpf: '',
      dob: '',
      phone: '',
      cep: '',
      state: '',
      city: '',
      neighborhood: '',
      complement: ''
    };
  }

  private convertDateToApiFormat(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  private convertDateToInputFormat(date: string): string {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  }
}
