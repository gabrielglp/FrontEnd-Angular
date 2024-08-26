import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ViaCepService } from '../auth/via-cep.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnChanges {
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
    complement: '',
  };
  isSubmitted = false;
  formError = '';
  phone: string | undefined;

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
      this.populateAddressFields(this.user.cep)
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
          this.cd.detectChanges();
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
    this.isSubmitted = true;

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

      if (this.user.clienteId === 0) {
        this.toastr.success('Cliente criado com sucesso!');
      } else {
        this.toastr.success('Cliente atualizado com sucesso!');
      }
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  public isFormValid(): boolean {
    if (this.user.name &&
        this.user.cpf &&
        this.user.dob &&
        this.user.phone &&
        this.user.cep &&
        this.user.state &&
        this.user.city &&
        this.user.neighborhood &&
        this.isValidCpf(this.user.cpf) &&
        this.isValidPhone(this.user.phone) &&
        this.isValidCep(this.user.cep)) {
      this.formError = '';
      return true;
    } else {
      this.formError = 'Por favor, preencha todos os campos obrigatórios.';
      return false;
    }
  }

  public isValidCpf(cpf: string): boolean {
    return cpf.replace(/\D/g, '').length === 11;
  }

  public isValidPhone(phone: string): boolean {
    return phone.replace(/\D/g, '').length >= 10;
  }

  public isValidCep(cep: string): boolean {
    return cep.replace(/\D/g, '').length === 8;
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
    this.isSubmitted = false;
    this.formError = '';
  }

  private convertDateToApiFormat(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  private convertDateToInputFormat(date: string): string {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  }

  public onCepBlur(): void {
    if (this.user.cep && this.user.cep.length === 8) {
      this.viaCepService.getAddress(this.user.cep).subscribe(
        address => {
          if (address) {
            this.user.state = address.uf;
            this.user.city = address.localidade;
            this.user.neighborhood = address.bairro;
            this.user.complement = address.complemento;
            this.cd.detectChanges();
          } else {
            this.toastr.error('Endereço não encontrado para o CEP informado.');
          }
        }
      );
    } 
  }

  onPhoneInput(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
  
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
  
    this.user.phone = this.applyMask(value);
  }
  

  private applyMask(value: string): string {
    value = value.replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    return value;
  }
}
