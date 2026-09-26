<div align="center">

# MatchFlow IA

**Análise visual e sugestões de conversa com inteligência artificial.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-API-8E75B2?logo=googlegemini&logoColor=white)

<img src="https://github.com/user-attachments/assets/6a8a5018-50e7-4c30-8c7b-bcd14aae4655" alt="Banner do MatchFlow IA" width="100%">

</div>

## Sobre

O MatchFlow IA é uma aplicação web experimental que analisa imagens para sugerir melhorias de apresentação e formas respeitosas de iniciar ou continuar conversas. A interface é responsiva e oferece modos para perfil, conversa, abordagem e análise visual.

As respostas são geradas por inteligência artificial, podem conter erros e não substituem avaliação profissional.

## Principais recursos

- upload de imagens JPEG, PNG e WebP com validação de tamanho;
- quatro modos de análise com respostas estruturadas;
- chave da API mantida exclusivamente no servidor;
- limitação básica de requisições por endereço IP;
- validação e normalização das respostas do provedor;
- interface responsiva e acessível a teclado;
- respeito à preferência de redução de movimento.

## Arquitetura

```text
Navegador ──POST /api/analyze──> Servidor Node.js ──> API Gemini
```

O navegador nunca recebe `GEMINI_API_KEY`. O servidor valida o tipo e o tamanho da imagem antes de encaminhá-la ao provedor de IA.

## Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Interface | React 19 + TypeScript |
| Estilos | Tailwind CSS 4 |
| Build | Vite 6 |
| Servidor | Node.js 20+ |
| IA | Google Gemini |

## Executar localmente

### Requisitos

- Node.js 20 ou superior;
- uma chave válida da API Gemini.

```bash
git clone <url-do-repositorio>
cd matchflowia
npm install
```

Copie `.env.example` para `.env.local` e preencha somente no arquivo local:

```env
GEMINI_API_KEY=sua_chave_aqui
PORT=3000
API_RATE_LIMIT=10
TRUST_PROXY=false
```

Inicie o projeto:

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | inicia o servidor e o Vite em modo de desenvolvimento |
| `npm run typecheck` | verifica os tipos TypeScript |
| `npm run build` | gera a interface de produção |
| `npm run check` | executa a verificação de tipos e o build |
| `npm start` | serve o build e a API em modo de produção |

## Produção

Configure `GEMINI_API_KEY` como variável secreta no provedor de hospedagem. Não use prefixos como `VITE_`, pois variáveis com esse prefixo são expostas no bundle do navegador.

O limite em memória reduz abusos em uma única instância. Em uma implantação pública com várias instâncias, substitua-o por um limitador distribuído e considere autenticação, cotas por usuário e monitoramento de custos.

Defina `TRUST_PROXY=true` somente quando a aplicação estiver atrás de um proxy confiável que sobrescreva `X-Forwarded-For`.

## Privacidade

- a aplicação não grava imagens em arquivos ou banco de dados;
- cada imagem é mantida apenas na memória necessária para processar a requisição;
- a imagem é enviada ao Google Gemini quando o usuário solicita a análise;
- o tratamento realizado pelo provedor segue os termos e a política de privacidade da conta que fornece a chave;
- não envie documentos, imagens de menores, dados sensíveis ou fotos de terceiros sem autorização.

## Segurança

Arquivos `.env` são ignorados pelo Git. Antes de publicar uma cópia do projeto, verifique também o histórico do Git e revogue imediatamente qualquer chave que tenha sido commitada anteriormente. Consulte [SECURITY.md](SECURITY.md) para relatar uma vulnerabilidade.

## Estrutura

```text
matchflowia/
├── components/
├── server/
│   └── gemini.mjs
├── services/
│   └── geminiService.ts
├── App.tsx
├── server.mjs
├── styles.css
└── vite.config.ts
```

## Status

Protótipo funcional em desenvolvimento.

## Licença

Distribuído sob a licença MIT. Consulte [LICENSE](LICENSE).
