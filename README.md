# ⚔️ BRMatched! — Em Batalha, Não Há Iguais! (Edição Comics PT-BR)

Site oficial, hub de downloads para Windows PC e área de membros do **BRMatched** — jogo brasileiro de **Deck-Building com Tabuleiro (Sistema DBT)** em estilo **quadrinhos (comics)**.

## 🚀 O que está incluído

- **Landing Page estilo HQ (`/`)**:
  - Hero com arte original em estilo comics dos lutadores da **Batalha das Lendas Vol. 1** (*Medusa*, *Rei Arthur*, *Alice* e *Simbad*).
  - **Catálogo Interativo de Lutadores**: clique em cada herói para ver retrato estilo comics, Medidor de Vida, Movimento, Alcance, Ajudantes, Habilidade Especial e 3 cartas icônicas traduzidas para PT-BR.
  - **Regras em 3 Ações + Anatomia das Cartas** (`Ataque`, `Defesa`, `Versátil`, `Estratagema`).
  - **Simulador de Duelo Rápido** jogável no navegador (*Rei Arthur vs Medusa*, com `Excalibur`, `Finta`, `Olhar de Pedra` e Medidores de Vida!).
  - Requisitos do sistema para Windows e leitor de edições do **Devlog**.
- **Central de Downloads Windows (`/downloads`)**: Destaque da build mais recente (`.exe` / `.zip`), contador real de downloads, checksum SHA-256 copiável, guia de instalação e histórico filtrável (`Todas`, `Estável`, `Beta`, `Alpha`).
- **Login & Cadastro Reais (`/login`, `/cadastro`)**: Autenticação com `scrypt` + token assinado (HMAC-SHA256) e banco local **SQLite** (`server/brmatched.db`).
- **Área de Membros & Painel Dev (`/dashboard`)**:
  - Cartão de Duelista personalizável (cor do avatar e Lutador Favorito).
  - Mural da Comunidade para enviar sugestões, balanceamentos e reportar bugs.
  - **Painel Dev / Upload (Admin)**: upload real de `.exe` / `.zip` (até 2 GB) com cálculo automático de tamanho e SHA-256 + publicação de novos Devlogs.

## 🔐 Contas Pré-Cadastradas

| Perfil | E-mail | Senha |
| --- | --- | --- |
| **Criador / Admin** | `admin@brmatched.com` | `admin123` |
| **Duelista / Membro** | `jogador@brmatched.com` | `player123` |

## 🛠️ Como Rodar

```bash
npm.cmd run dev     # Modo desenvolvimento (API 3001 + Vite 5173)
# ou
npm.cmd run build
npm.cmd start       # Tudo servido em http://localhost:3001
```
