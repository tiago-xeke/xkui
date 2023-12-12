# [VCET](# "View Component Element Text" )

## Propriedades

```string name``` VCE

Retorna o nome do item

```string type``` VCET

Propriedade que representa o tipo do item, os tipos são:
1. "view"
2. "component"
3. "element"
4. "text"

```Array path``` VCET

Array que contém os pais do item

```string container``` VCET

Propriedade que contém o pai do item, no caso das View é o container definido pelo ```xkui.setContainer()```

```handle item``` VCET

Retorna o Componente manipulável da View ou Componente, no caso de elementos e textos, são retornados os elementos do DOM Real

```Array items``` VCE

Retorna todos os filhos do item

## Manipulando atributos

### Eventos VCE

No xkui os eventos não passam de atributos especiais, os eventos são:
1. click 
2. doubleclick 
3. mousedown
4. mouseup
5. mousemove
6. mouseout
7. mouseover
11. focus
12. blur
13. change
15. input
16. load
17. unload
18. resize
19. scroll
20. touchstart
21. touchmove
22. touchend
23. touchcancel

```Array item.attributes``` VCE

Array de atributos

```void item.addAttribute(string name,auto value)``` VCE

Cria um atributo

```void item.setAttribute(string name,auto value)``` VCE

Atualiza um atributo

```void item.toggleAttribute(string name)``` VCE

Alterna o valor de um atributo booleano

```auto item.getAttribute(string name)``` VCE

Retorna o valor de um atributo

```boolean item.hasAttribute(string name)``` VCE

Retorna se o atributo existe

```integer item.indexAttribute(string name)``` VCE

Retorna a posição do atributo na Array de atributos, caso ele não exista será retornado -1

## Métodos

```object Item.getScroll()``` VE

Retorna as coordenadas de scoll do item

```object Item.setScroll()``` VE

Define as coordenadas de scoll do item

```object Item.getOffset()``` VE

Retorna as principais coordenadas do item, as coordenadas são:
1. scaleX
2. scaleY
3. scrollScaleX
4. scrollScaleY
5. insertX
6. insertY
7. viewportInsertX
8. viewportInsertY

```integer Item.index()``` CET

Retorna a posição do item na lista de items filhos de seu Container

```void Item.move(element container)``` CET

Move o item para o novo elemento pai

```void Item.delete()``` CET

Deleta o item

```void Item.render(string elements,integer index)``` VCE

Renderiza novos elementos no item na posição especificada

```elements Item.clone()``` VCET

Clona o item

```void Item.clear()``` VCE

Limpa todos os elementos do item

```element Item.query()``` VCE

Retorna um elemento buscado

```element Item.queryAll()``` VCE

Retorna todos elementos buscados

```void Item.stylize(string queryAll,string style)``` VCE

Estiliza todos os elementos buscados com o estilo especificado, no caso dos elementos apenas eles são estilizados sem a necessidade de queryAll

```void Item.addProperty(string name,function callback or string newName)``` VC

Cria uma nova propriedade para os estilos que se aplicarão a seus items filhos, se o segundo parametro não for uma função, então a propriedade ao invés de "compilada" ela será traduzida para newName

```void Item.setProperty(string name,function callback or string newName)``` VC

Atualiza uma propriedade customizada

```customProperty Item.getProperty(string name)``` VC

Retorna as informações da propriedade customizada

```void Item.deleteProperty(string name)``` VC

Deleta a propriedade customizada

```void Item.addFunction(string name,function callback)``` VC

Cria uma nova função para ser usada pelos estilos deste item

```void Item.setFunction(string name,function callback)``` VC

Atualiza uma função para ser usada pelos estilos deste item

```customFunction Item.getFunction(string name)``` VC

Retorna as informações de uma função customizada

```customFunction Item.deleteFunction(string name)``` VC

Deleta uma função customizada

## Procedimentos

```void Component.item.render()``` VC

Procedimento que é chamado quando o item é iniciado, a função deste procedimento é renderizar todos os elementos filhos

```void Component.item.initialize()``` VC

Procedimento que é chamado quando o item é iniciado, um das funções deste procedimento é definir eventos para os elementos filhos

```void Component.item.update()``` VC

Procedimento que é chamado quando o item precisa ser atualizado, um das funções deste procedimento é atualizar os estilos dos elementos filhos

```void Component.item.finalize()``` VC

Procedimento que é chamado quando o item precisa ser excluido, um das funções deste procedimento é liberar recursos

## Manipulando textos

```void Component.setText(string text)``` VCET

Define o texto do item, em caso onde o item não é um texto é definido o texto do primeiro elemento de texto encontrado

```string Component.getText()``` VCET

Retorna o texto do item, em caso onde o item não é um texto é retornado o primeiro elemento de texto encontrado
