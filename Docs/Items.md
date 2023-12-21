# [VCET](# "View Component Element Text" )

## Propriedades

```string name``` VCE

- [x] Retorna o nome do item

```string type``` VCET

- [x] Propriedade que representa o tipo do item, os tipos são:
1. "view"
2. "component"
3. "element"
4. "text"

```Array path``` VCET

- [x] Array que contém os pais do item

```string container``` VCET

- [x] Propriedade que contém o pai do item, no caso das View é o container definido pelo ```xkui.setContainer()```

```handle item``` VCET

- [x] Retorna o Componente manipulável da View ou Componente, no caso de elementos e textos, são retornados os elementos do DOM Real

```Array items``` VCE

- [x] Retorna todos os filhos do item

## Manipulando atributos

### Eventos VCE

No xkui os eventos não passam de atributos especiais

```Array item.attributes``` VCE

- [x] Array de atributos

```void item.setAttribute(string name,auto value)``` VCE

- [x] Atualiza ou cria um atributo

```void item.toggleAttribute(string name)``` VCE

- [x] Alterna o valor de um atributo booleano

```auto item.getAttribute(string name)``` VCE

- [x] Retorna o valor de um atributo

```boolean item.hasAttribute(string name)``` VCE

- [x] Retorna se o atributo existe

```integer item.indexAttribute(string name)``` VCE

- [x] Retorna a posição do atributo na Array de atributos, caso ele não exista será retornado -1

## Métodos

- [x] ```object Item.getScroll()``` VE

Retorna as coordenadas de scoll do item

- [x] ```object Item.setScroll()``` VE

Define as coordenadas de scoll do item

- [x] ```object Item.getOffset()``` VE

Retorna as principais coordenadas do item, as coordenadas são:
1. scaleX
2. scaleY
3. scrollScaleX
4. scrollScaleY
5. insertX
6. insertY
7. viewportInsertX
8. viewportInsertY

- [x] ```integer Item.index()``` CET

Retorna a posição do item na lista de items filhos de seu Container

- [x] ```void Item.move(element container)``` CET

Move o item para o novo elemento pai

- [x] ```void Item.delete()``` CET

Deleta o item

- [x] ```void Item.render(string elements,integer index)``` VCE

Renderiza novos elementos no item na posição especificada

- [x] ```elements Item.clone()``` VCET

Clona o item

- [x] ```void Item.clear()``` VCE

Limpa todos os elementos do item

- [ ] ```element Item.query()``` VCE

Retorna um elemento buscado

- [ ] ```element Item.queryAll()``` VCE

Retorna todos elementos buscados

- [ ] ```void Item.stylize(string queryAll,string style)``` VCE

Estiliza todos os elementos buscados com o estilo especificado, no caso dos elementos apenas eles são estilizados sem a necessidade de queryAll

- [ ] ```void Item.setProperty(string name,function callback or string newName)``` VC

Cria uma nova propriedade para os estilos que se aplicarão a seus items filhos, se o segundo parametro não for uma função, então a propriedade ao invés de "compilada" ela será traduzida para newName

- [ ] ```void Item.deleteProperty(string name)``` VC

Deleta a propriedade customizada

- [ ] ```void Item.setFunction(string name,function callback)``` VC

Cria uma nova função para ser usada pelos estilos deste item

- [ ] ```customFunction Item.deleteFunction(string name)``` VC

Deleta uma função customizada

## Procedimentos

- [x] ```void Component.item.render()``` VC

Procedimento que é chamado quando o item é iniciado, a função deste procedimento é renderizar todos os elementos filhos

- [x] ```void Component.item.initialize()``` VC

Procedimento que é chamado quando o item é iniciado, um das funções deste procedimento é definir eventos para os elementos filhos

- [ ] ```void Component.item.update()``` VC

Procedimento que é chamado quando o item precisa ser atualizado, um das funções deste procedimento é atualizar os estilos dos elementos filhos

- [x] ```void Component.item.finalize()``` VC

Procedimento que é chamado quando o item precisa ser excluido, um das funções deste procedimento é liberar recursos

## Manipulando textos

- [x] ```void Component.setText(string text)``` VCET

Define o texto do item, em caso onde o item não é um texto é definido o texto do primeiro elemento de texto encontrado

- [x] ```string Component.getText()``` VCET

Retorna o texto do item, em caso onde o item não é um texto é retornado o primeiro elemento de texto encontrado