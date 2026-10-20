# Publicar na Vercel — pacote atualizado

Use os arquivos da pasta `publicar-vercel`. Nunca envie `publicar-vercel.zip` ao GitHub: ele tem cerca de 69 MB e ultrapassa o limite de 25 MiB por arquivo no navegador. O GitHub também não extrai ZIPs para publicar o site.

Para facilitar, a pasta `enviar-github` contém os mesmos arquivos separados em lotes de até 18 MiB. Abra `lote-01`, selecione os arquivos de dentro e envie para a raiz do repositório em Add file > Upload files; clique Commit changes. Repita com cada lote seguinte no mesmo repositório. Não envie as pastas `lote-XX`, o manifesto ou as instruções. Depois do último lote, todos os arquivos do site devem estar juntos na raiz. Só então importe na Vercel.

Essa pasta tem 36 arquivos do site, todos no mesmo nível, sem subpastas. Imagens e vídeo são arquivos do conteúdo: precisam ser enviados junto com o HTML. Não são documentos de instruções.

## Publicar pelo GitHub + Vercel

1. Crie um repositório no GitHub.
2. Abra a pasta `publicar-vercel`, selecione TODOS os arquivos e envie para a raiz do repositório. O `index.html` e o `vercel.json` devem aparecer diretamente na raiz; não envie o ZIP fechado.
3. Na Vercel, escolha Add New > Project e importe esse repositório.
4. Root Directory: raiz do repositório. Framework Preset: Other. Build Command: vazio. Output Directory: . (um ponto).
5. Clique em Deploy.

O `vercel.json` incluído já contém a configuração estática. Esta versão não precisa de npm install, build, chave de API ou banco de dados.

## Links da Hotmart

No `config.js`, preencha:

- `plans.basic.checkoutUrl`: checkout do Básico, com apenas o ebook principal, por US$ 9,90.
- `plans.premium.checkoutUrl`: checkout do Premium completo, por US$ 19,90.
- `plans.premiumSpecial.checkoutUrl`: checkout da oferta especial do Premium, por US$ 15,90.

Crie as ofertas correspondentes na Hotmart: mudar o preço exibido no site não muda o valor cobrado pela Hotmart.

Enquanto os links estiverem vazios, a escolha abre um resumo local com o preço e o conteúdo corretos, mas o pagamento fica desativado.

## Comportamento dos planos

- Os botões de interesse vão à oferta dentro da página.
- Escolher Básico abre o pop-up de upgrade para Premium por US$ 15,90.
- Aceitar leva à oferta especial da Hotmart, quando configurada.
- Recusar permite continuar no Básico por US$ 9,90.
- Escolher Premium diretamente leva à oferta normal de US$ 19,90.
- O pop-up pode ser fechado pelo X ou pela tecla Escape.

## Atualizar depois

O projeto editável continua na pasta principal `biblic-world-3d`. Após alterações, `npm run package:vercel` recria a pasta de publicação. Compacte novamente se precisar de um ZIP atualizado.

O contador continua em 14:13 por acesso. Os avisos de compra de exemplo continuam identificados como demonstração. Esta preparação não fez um deploy na sua conta.
