# 💈 Barbearia do Jota - Sistema de Agendamento

Este é um aplicativo móvel desenvolvido com **React Native** e **Expo**, projetado para modernizar o atendimento da Barbearia do Jota. O app permite que clientes agendem serviços de forma intuitiva, enviando os dados diretamente para o WhatsApp do barbeiro e mantendo um registro local para gestão.

## 🚀 Funcionalidades

* **Agendamento Inteligente:** O cliente preenche Nome, Telefone, Data e Hora.
* **Validação de Horário Comercial:** O sistema só permite agendamentos entre **6:00 AM** e **10:00 PM**.
* **Máscaras Automáticas:** Campos de data (DD/MM/AAAA) e hora formatados automaticamente para evitar erros.
* **Integração com WhatsApp:** Envio de mensagem formatada com todos os detalhes do serviço escolhido.
* **Área do Dono (Gestão):** O app gera e mantém um arquivo **CSV (Planilha)** interno com todos os agendamentos realizados, que pode ser exportado pelo Jota a qualquer momento.
* **Design Premium:** Interface em Dark Mode com detalhes em dourado, proporcionando uma experiência luxuosa.

## 🛠️ Tecnologias Utilizadas

* [React Native](https://reactnative.dev/)
* [Expo](https://expo.dev/)
* [Expo FileSystem](https://docs.expo.dev/versions/latest/sdk/filesystem/) (Banco de dados local em CSV)
* [Expo Sharing](https://docs.expo.dev/versions/latest/sdk/sharing/) (Exportação de dados)

## 📁 Estrutura de Arquivos Principal

* `App.js`: Contém toda a lógica de interface, validações de horário e manipulação de arquivos.
* `app.json`: Configurações de identidade do app (ícone, splash screen e slug).
* `package.json`: Dependências e scripts do projeto.
* `/assets`: Imagens de ícone e carregamento.

## 🔧 Como Executar

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/SEU_USUARIO/barbearia-app.git](https://github.com/SEU_USUARIO/barbearia-app.git)
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npx expo start --tunnel
    ```
4.  Escaneie o QR Code com o aplicativo **Expo Go** no seu celular.

---
Desenvolvido por **Mac-Toni** para a Barbearia do Jota. ✂️