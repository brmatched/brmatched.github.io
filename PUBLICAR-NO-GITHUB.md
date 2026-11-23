# Como Publicar o Site e o `.exe` do BRMatched 100% Grátis no GitHub

Este projeto já está 100% configurado para rodar gratuitamente no **GitHub Pages** (site) + **GitHub Releases** (instalador `.exe` até 2 GB com downloads ilimitados e contador automático!).

---

## Passo 1 — Criar sua conta no GitHub (2 min)

1. Acesse **https://github.com/signup**
2. Crie sua conta gratuita (escolha um nome de usuário legal, ex.: `brmatched` ou seu nome/estúdio — ele vai aparecer na URL do site: `https://SEU-USUARIO.github.io/brmatched/`).
3. Confirme seu e-mail.

---

## Passo 2 — Criar o repositório do site

1. No GitHub, clique no botão **`+`** (canto superior direito) → **New repository**.
2. Em **Repository name**, digite: `brmatched`
3. Deixe marcado como **Public** (necessário para GitHub Pages gratuito e downloads públicos).
4. Clique em **Create repository**.

---

## Passo 3 — Enviar a pasta `brmatched-site` para o GitHub

A forma mais fácil no Windows (sem precisar decorar comandos) é usar o **GitHub Desktop**:

1. Baixe e instale o **GitHub Desktop**: **https://desktop.github.com**
2. Faça login com a sua conta do GitHub.
3. Clique em **File → Add local repository...** e selecione a pasta:
   `C:\Users\Dell\.gemini\antigravity\scratch\brmatched-site`
4. Se o GitHub Desktop avisar que não é um repositório Git, clique em **create a repository** (mantenha o nome `brmatched` e deixe o `.gitignore` existente).
5. Escreva uma mensagem como `Primeira versão do site BRMatched`, clique em **Commit to main** e depois em **Publish repository** (desmarque *"Keep this code private"* para deixar público!).

---

## Passo 4 — Ativar o GitHub Pages (Publicação Automática)

1. Abra seu repositório no navegador (`https://github.com/SEU-USUARIO/brmatched`).
2. Clique em **Settings** (Configurações) → no menu esquerdo, clique em **Pages**.
3. Em **Build and deployment → Source**, mude de *"Deploy from a branch"* para **GitHub Actions**.
4. Vá na aba **Actions** no topo do repositório → clique em **Publicar BRMatched no GitHub Pages** → clique em **Run workflow** (se já não tiver iniciado sozinho).
5. Em ~1 minuto, seu site estará no ar no link:
   **`https://SEU-USUARIO.github.io/brmatched/`**

---

## Passo 5 — Subir o instalador `.exe` (~495 MB) no GitHub Releases

1. Na página principal do seu repositório no GitHub, olhe a coluna da direita e clique em **Releases** → **Create a new release**.
2. Em **Choose a tag**, digite `v2.0-beta` e clique em **Create new tag: v2.0-beta on publish**.
3. Em **Release title**, coloque:
   `Beta 2.0 — 6 Heróis Lendários (PT-BR Comics)`
4. Em **Describe this release**, cole as novidades (elas vão aparecer automaticamente no site!):
   ```text
   NOVO: Pé-Grande (com Jackalope) e Robin Hood (com 4 Foras-da-Lei) agora jogáveis no Beta 2.0!
   COMPLETO: Elenco com 6 heróis lendários — Medusa, Rei Arthur, Alice, Sinbad, Pé-Grande e Robin Hood — todos com baralhos de 30 cartas em PT-BR e arte Comics.
   NOVO: Arenas Floresta de Sherwood e Yukon adicionadas ao lado de Marmoreal e Sarpedon.
   MELHORIA: Motor de combate fiel à ordem Imediatamente → Durante o Combate → Após o Combate, incluindo cancelamento por Finta.
   ```
5. Na área **"Attach binaries by dropping them here or selecting them"**, arraste o arquivo:
   `C:\Users\Dell\Desktop\BRmatched_App\dist-beta-2.0\BRMATCHED-Beta-2.0-Setup-Windows-x64.exe`
6. Marque **Set as a pre-release** (se quiser exibir a tag `BETA`) e clique em **Publish release**.

### Pronto! O que acontece automaticamente depois disso?
- Assim que você publicar a Release no GitHub, o site **detecta sozinho** o `.exe`, o **tamanho real (~472 MB)**, as **notas da versão** e o **contador real de downloads**!
- Nas próximas atualizações (`v2.1-beta`, `v3.0`, etc.), você só precisa criar uma nova Release no GitHub e arrastar o novo `.exe` — o site se atualiza sozinho!
