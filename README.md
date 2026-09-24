<div align="center">

# MatchFlow IA

**Análise visual, conversa e estratégia social com inteligência artificial.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-API-8E75B2?logo=googlegemini&logoColor=white)


<img src="https://github.com/user-attachments/assets/6a8a5018-50e7-4c30-8c7b-bcd14aae4655" alt="Banner do MatchFlow IA" width="100%">

</div>

## Sobre o projeto

O **MatchFlow IA** é uma aplicação web que usa a API do Google Gemini para gerar orientações personalizadas a partir de texto e imagens. A interface reúne diferentes modos de análise em uma experiência responsiva e direta.

> Projeto experimental. As respostas são geradas por inteligência artificial e não substituem avaliação profissional.

## Funcionalidades

- análise visual de uma imagem enviada pelo usuário;
- conversa contextual com a IA;
- sugestões de abordagem e interação;
- análise estratégica de perfil;
- respostas estruturadas em JSON para apresentação na interface;
- cache em memória para consultas repetidas;
- novas tentativas automáticas quando a API atinge o limite de requisições.

## Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Interface | React 19 + TypeScript |
| Build | Vite 6 |
| Estilos | Tailwind CSS |
| Inteligência artificial | Google Gemini |
| Validação de respostas | Schema JSON da API Gemini |

## Como executar

### Pré-requisitos

- Node.js 18 ou superior;
- uma chave da API Gemini.

```bash
git clone https://github.com/pedrobertanhi/matchflowia.git
cd matchflowia
npm install
```

Crie o arquivo `.env.local` na raiz:

```env
GEMINI_API_KEY=sua_chave_aqui
```

Inicie o ambiente:

```bash
npm run dev
```

Abra o endereço exibido pelo Vite no terminal.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | inicia o servidor de desenvolvimento |
| `npm run build` | gera a versão de produção |
| `npm run preview` | abre uma prévia do build |

## Privacidade

As imagens e mensagens inseridas na aplicação são enviadas à API Gemini para processamento. Evite enviar documentos, dados pessoais sensíveis ou imagens de terceiros sem autorização.

## Estrutura principal

```text
matchflowia/
├── components/
├── services/
│   └── geminiService.ts
├── App.tsx
├── index.tsx
└── package.json
```

## Status

Protótipo funcional em desenvolvimento.

---

Desenvolvido por [Pedro Bertanhi](https://github.com/pedrobertanhi).
