# xkui
Uma biblioteca para criar interface de usuários com Javascript

## Introdução
Antes de começarmos a apresentar a biblioteca em si, precisamos mostrar algumas de nossas regras:

1. [**ESC**](# "Elements Styles Codes" ), Está regra implica que assim como a WEB padrão, as interfaces de usuários devem ser divididas em três áreas, a área dos elementos, dos estilos e códigos
2. [**COIC**](# "Code Only In Code" ), Está regra implica que o código só deve ser escrito na área dos códigos, o mesmo serve para os elementos e estilos, a única e exceção é para pequenas declarações
3. [**NR**](# "No Reactive" ), Está regra implica que as interfaces de usuários não devem ser reativas, isso para evitar imprevisibilidade, sem contar que reatividade não combina com interfaces de usuários de modo retido
4. [**DFPP**](# "Dependency Free & Plug and Play" ), Está regra implica que a biblioteca deve ser livre de dependências externas, e além disso a biblioteca deve funcionar sem o uso de analisadores, compiladores & transpiladores de terceiros
5. [**MVC**](# "Model View Control" ), Não é uma regra mas a biblioteca é feita para funcionar melhor com a arquitetura MVC
6. [**SPA**](# "Single Page Application" ), Não é uma regra mas a biblioteca é feita para funcionar melhor com aplicações de Página única

## Views

As Views são páginas de HTML Virtual, as Views armazenam componentes, elementos e texto e também contém métodos e váriaveis próprias e customizadas

### Manipulando Views na biblioteca

```void addView(string name,string elements)```

Cria uma View

```void setView(string name,string elements)```

Atualiza uma View

```void deleteView(string name)```

Deleta uma View

```View getView(string name)```

Retorna uma View

```View saveView()```

Retorna uma cópia da View que está sendo renderizada

```void restoreView(View View)```

Restaura e renderiza uma View

```void renderView(string name)```

Renderiza uma View

```void setContainer(DOMElement container)```

Define o Container da View (Padrão = document.body)

```DOMElement getContainer()```

Retorna o Container da View

### Métodos e propriedades das Views

```string type```

Propriedade que representa o tipo do elemento, neste caso o valor é "view"

```string container```

Propriedade que contém o pai do elemento (Padrão = document.body)

```Array path```

Array que contém os pais do elemento, neste caso o valor é ["root",document.body]

```Array items```

Retorna todos os filhos da View

```ViewHandle item```

Retorna o Componente manipulável da View

#### Atributos das Views

```Array item.attributes```

Array de atributos da View

```void item.addAttribute(string name,auto value)```

Cria um atributo na View

```void item.setAttribute(string name,auto value)```

Atualiza um atributo na View

```void item.toggleAttribute(string name)```

Alterna o valor de um atributo booleano na View

```auto item.getAttribute(string name)```

Retorna o valor de um atributo na View

```boolean item.hasAttribute(string name)```

Retorna se o atributo existe na View

```integer item.indexAttribute(string name)```

Retorna a posição do atributo na Array de atributos na View, caso ele não exista será retornado **-1**

#### métodos de renderização

```void View.render(string elements,integer index)```

Renderiza novos elementos na View na posição especificada

```elements View.clone()```

Clona os elementos da View

```void View.clear()```

Limpa todos os elementos da View

```element View.query()```

Retorna um elemento buscado

```element View.queryAll()```

Retorna todos elementos buscados
