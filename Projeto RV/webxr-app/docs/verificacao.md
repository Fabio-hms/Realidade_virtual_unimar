# Verificação — Módulo 03

Registro atualizado em 28/09/2026. Este documento reúne o teste funcional local informado pelo grupo e as verificações automatizadas realizadas durante a revisão do projeto.

## Teste funcional local do grupo

A aplicação foi executada em um notebook físico Acer Aspire 5, pelo Google Chrome. O integrante do grupo que realizou a execução confirmou que o projeto rodou com funcionamento geral conforme esperado.

| Aparelho | Navegador | Regime executado | Resultado informado |
| --- | --- | --- | --- |
| Notebook Acer Aspire 5 | Google Chrome | Em tela, no navegador (desktop) | Aplicação executada e funcionamento geral confirmado |

Este registro documenta o resultado funcional da execução local. Os valores numéricos apresentados adiante pertencem ao ambiente automatizado identificado na seção seguinte.

## Verificações automatizadas da revisão

Verificações registradas em 27/09/2026, no ambiente de revisão com apoio do ChatGPT/Codex: Node.js 24.19.0, npm 11.9.0 e Linux x86_64. As dependências foram instaladas conforme o `package-lock.json`. A interface foi verificada no Chromium 153.0.8010.0 automatizado, com WebGL 2 por ANGLE/SwiftShader.

| Verificação | Resultado registrado |
| --- | --- |
| `npm run typecheck` | Verificação estática concluída sem erros |
| `npm run build` | Compilação de produção concluída; permanece o aviso de bundle acima de 500 kB |
| `npm test` | Oito testes aprovados, cobrindo inventário, hierarquia, reparentagem, fronteiras, relógio, orçamento e estados da sonda |
| Interface em 1440 × 1000 e 390 × 844 | Cena aberta sem exceções JavaScript; página sem transbordamento horizontal na verificação estreita |
| Comandos da demonstração | Movimento, troca de pai, reinício e exportação executados |
| Relatório de recursos | Exibição das respostas de suporte fornecidas pelo navegador automatizado |

Após a separação do módulo `webxr-app/src/demos/03_demo.ts`, o build e os oito testes foram executados novamente e aprovados. A verificação no navegador confirmou o carregamento do módulo, um único canvas e o funcionamento dos comandos e da exportação, sem exceções JavaScript.

## Medições registradas no ambiente automatizado

Amostra de 27/09/2026, às 14:45:24.185 UTC, capturada durante a primeira verificação de interface, com cliques e capturas de tela. Trata-se de uma amostra dessa execução, sem protocolo de benchmark estável. Estes números não são medições do Acer Aspire 5.

| Medida | Resultado da amostra |
| --- | ---: |
| Quadros guardados | 90 |
| Custo médio de CPU/submissão | 0,835556 ms |
| Intervalo médio entre quadros | 17,962311 ms |
| Pior intervalo entre quadros | 116,700000 ms |
| Intervalos acima de 16,67 ms | 60 |
| Chamadas no último desenho | 46 |
| Triângulos | 594 |
| Desvio de posição na troca de pai | 5,551115123126 × 10⁻¹⁷ m |
| Maior diferença entre elementos da matriz mundial | 5,551115123126 × 10⁻¹⁷ |

Na troca de pai, o objeto passou de `area-de-apoio` para `trilho-principal`. Sua posição mundial foi preservada, com diferença residual numérica:

- Antes: `(-0.125; 0.8410000000000001; 0.12)` m.
- Depois: `(-0.125; 0.8410000000000001; 0.12000000000000005)` m.

O intervalo médio da amostra ficou acima da meta de 16,67 ms. O custo de CPU/submissão e o intervalo entre quadros são medidas diferentes; o tempo de GPU não integra essa medição.

## Escopo verificado

O teste local registrado cobre a execução da cena em tela. Nesta versão, a sonda consulta capacidades de VR/AR, enquanto a demonstração da cena ocorre no navegador em modo desktop.

O comando de troca de pai demonstra a preservação da transformação mundial. Pegar o disjuntor com a mão e encaixá-lo automaticamente no trilho são funcionalidades previstas para a evolução da interação, fora do escopo funcional verificado nesta entrega.
