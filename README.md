# xkui
Uma biblioteca para criar interface de usuários com Javascript

## Introdução
Antes de começarmos a apresentar a biblioteca em si, precisamos mostrar algumas de nossas regras:

1. [**ESC**](# "Elements Styles Codes" ), Está regra implica que assim como a WEB padrão, as interfaces de usuários devem ser divididas em três áreas, a área dos elementos, dos estilos e códigos
2. [**COIC**](# "Code Only In Code" ), Está regra implica que o código só deve ser escrito na área dos códigos, o mesmo serve para os elementos e estilos, a única e exceção é para pequenas declarações
3. [**NR**](# "No Reactive" ), Está regra implica que as interfaces de usuários não devem ser reativas, isso para evitar imprevisibilidade, sem contar que reatividade não combina com interfaces de usuários de modo retido
4. [**DFPP**](# "Dependency Free & Plug and Play" ), Está regra implica que as interfaces de usuários não devem ser reativas, isso para evitar imprevisibilidade, sem contar que reatividade não combina com interfaces de usuários de modo retido
-*df*, Dependency free, o *xkui* é livre de dependências externas
-*mvc*, Single Page Application, as aplicações feitas pelo *xkui* devem ser de página única
-*spa*, Single Page Application, as aplicações feitas pelo *xkui* devem ser de página única

## Views

As Views podem ser consideradas páginas HTML, porém as páginas HTML atualizam o navegador para serem exibidas, já as Views não

### void ADD(string name,string elements)

Cria uma nova View

### void SET(string name,string elements)

Atualiza uma View

### void DELETE(string name)

Delete uma View

### View GET(string name)

Retorna uma View

### View SAVE(string name)

Retorna uma cópia da View

### void RENDER(string name or VIEW View)

Renderiza uma View (Também serve para rastaurar uma View)

### SET_CONTAINER(DOMElement container)

Define o Container da view (O padrão é document.body)

### DOMElement ITEM

Retorna o Container da View

### Array ITEMS

Retorna todos os f

### ADD_ATTRIBUTE(string name,string value)

Cria um novo atributo na View

### SET_ATTRIBUTE(string name,string value)

Atualiza um atributo na View

### TOGGLE_ATTRIBUTE(string name)

Alterna o valor de um atributo booleano na View

### GET_ATTRIBUTE(string name)

Retorna o valor de um atributo na View

### Boolean HAS_ATTRIBUTE(string name)

Retorna se um atributo existe na View

### INTEGER INDEX_ATTRIBUTE(string name)

Retorna a posição do atributo na View
