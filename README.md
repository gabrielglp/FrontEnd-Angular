# FrontAngular

Este projeto foi gerado com [Angular CLI](https://github.com/angular/angular-cli) version 12.1.4.

# Projeto Angular com API .NET 5.0
Este projeto é uma aplicação Angular que se comunica com uma API .NET 5.0. O projeto inclui funcionalidades de autenticação, gerenciamento de clientes e integração com o serviço de consulta de CEP.

## 2. Configuração do Frontend (Angular)
### 1. Clone o repositório do frontend:

```bash
git clone <URL_DO_REPOSITORIO_FRONTEND>
cd <NOME_DO_REPOSITORIO_FRONTEND>
```
## 2.Instale as dependências:

```bash
npm install
```
- #### 2.1 Lembrando o Node tem que está pelo menos na versão 14.21.3
  ## Instalação do nvm-windows

Para instalar o nvm no Windows, siga estas etapas:

1. Baixe o instalador do nvm-windows:
   [nvm-setup.exe](https://github.com/coreybutler/nvm-windows/releases/download/1.1.12/nvm-setup.exe)

2. Execute o instalador e siga as instruções na tela.

3. Após a instalação, abra o terminal e verifique a instalação com o comando:
 ```bash
 nvm --version
 ```
- Está ferramenta permite instalar, gerenciar e alternar entre diferentes versões do Node.js em seu ambiente de desenvolvimento
```bash
nvm install 14
nvm use 14
```
### 3. Inicie o servidor de desenvolvimento:

```bash
ng serve
```
A aplicação Angular estará disponível em http://localhost:4200.

## 4. Configuração da API de Consulta de CEP
1. A API de consulta de CEP utilizada é o ViaCEP.

- Endpoint: https://viacep.com.br/ws/{cep}/json/
- Método: GET
- Parâmetros: cep (o CEP a ser consultado)
O serviço ViaCepService já está configurado para consumir essa API e obter informações sobre o endereço a partir do CEP.

## Scripts Disponíveis
- Para iniciar o backend: dotnet run (a partir do diretório do backend)
- Para iniciar o frontend: ng serve (a partir do diretório do frontend)
- Para criar o banco de dados: dotnet ef migrations add InitialCreate e - dotnet ef database update (a partir do diretório do backend)
## Estrutura do Projeto
- Backend (.NET 5.0)

- Controllers/: Contém os controladores da API
- Models/: Contém os modelos de dados
- Migrations/: Contém as migrations do Entity Framework
- Program.cs: Configuração do servidor e serviços
- Startup.cs: Configuração de serviços e pipeline de middleware
- Frontend (Angular)

- src/app/auth/: Serviços e guards relacionados à autenticação
- src/app/clientes/: Componentes e serviços relacionados ao gerenciamento de - clientes
- src/environments/: Configurações de ambiente
- src/assets/: Arquivos estáticos e estilos
## Notas Adicionais
- Certifique-se de que o backend e o frontend estão rodando simultaneamente para garantir a comunicação adequada entre ambos.
- Para autenticação e autorização, o frontend usa o serviço AuthService e o AuthInterceptor para adicionar tokens de autenticação às requisições HTTP.
