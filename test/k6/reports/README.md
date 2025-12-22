# K6 Reports

Este diretório contém os relatórios de execução dos testes de performance k6.

## Arquivos Gerados

Os relatórios são gerados automaticamente ao executar os scripts com `-report`:

```bash
npm run k6:rest-load-report
```

Isso irá gerar:

- `rest-load.json` - Dados brutos do teste em JSON
- `rest-load.html` - Relatório visual em HTML

## Visualizando Relatórios

Abra os arquivos `.html` diretamente no navegador:

- Windows: Clique duplo no arquivo
- macOS/Linux: `open rest-load.html`

## Tipos de Relatórios

- **rest-load.html** - Teste de carga REST
- **rest-stress.html** - Teste de estresse REST
- **rest-spike.html** - Teste de pico REST

## Limpeza

Para remover relatórios antigos:

```bash
# Windows
del test\k6\reports\*.json
del test\k6\reports\*.html

# macOS/Linux
rm test/k6/reports/*.json
rm test/k6/reports/*.html
```
