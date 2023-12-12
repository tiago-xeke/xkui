# Métodos da biblioteca

## Views

```void addView(string name,string elements,object viewHandle)```

Cria uma View

```void setView(string name,string elements,object viewHandle)```

Atualiza uma View

```void deleteView(string name)```

Deleta uma View

```View getView(string name)```

Retorna uma View

```View cloneView()```

Retorna uma cópia da View que está sendo renderizada

```void renderView(string name or View view)```

Renderiza ou restaura uma View

```View view```

O objeto da View atualmente renderizada

## Componentes

```void addComponent(string name,function callback)```

Cria um Componente

```void setComponent(string name,function callback)```

Atualiza um Componente

```void deleteComponent(string name)```

Deleta um Componente

```View getComponent(string name)```

Retorna um Componente

## Containers

```void setContainer(DOMElement container)```

Define o Container onde as Views serão renderizadas (Padrão = document.body)

```DOMElement getContainer()```

Retorna o Container onde as Views serão renderizadas

## Segurança

```string clearAttribute(string attributeValue)```

Limpa um atributo para evitar ataques XSS

```string clearText(string text)```

Limpa um texto para evitar ataques XSS