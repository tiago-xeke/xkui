# Métodos da biblioteca

## Views

```void setView(string name,string elements,object viewHandle)```

- [x] Atualiza uma View

```void deleteView(string name)```

- [x] Deleta uma View

```View cloneView()```

- [ ] Retorna uma cópia da View que está sendo renderizada

```void renderView(string name or View view)```

- [ ] Renderiza ou restaura uma View

```View view```

- [x] O objeto da View atualmente renderizada

## Componentes

```void setComponent(string name,function callback)```

- [x] Atualiza um Componente

```void deleteComponent(string name)```

- [x] Deleta um Componente

## Containers

```void setContainer(DOMElement container)```

- [x] Define o Container onde as Views serão renderizadas (Padrão = document.body)

```DOMElement getContainer()```

- [x] Retorna o Container onde as Views serão renderizadas

## Segurança

```string clearAttribute(string attributeValue)```

- [ ] Limpa um atributo para evitar ataques XSS

```string clearText(string text)```

- [ ] Limpa um texto para evitar ataques XSS