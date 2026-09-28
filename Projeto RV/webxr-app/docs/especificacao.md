# Especificação — Quadro elétrico em trilho

Revisão de 27/09/2026 para os Módulos 01 a 03. Os valores são parâmetros do protótipo didático, não medidas certificadas de componentes comerciais. As mudanças desta revisão estão registradas na seção 14.

## 1. Identificação do grupo e da cena

**Grupo 8.** Integrantes, conforme a especificação recebida: Fábio Henrique Miguel Silva, Luís Fernando Kameda Carvajhal, Pedro Henrique Barbosa e João Guilhermo Sabongi.

**Cena:** quadro elétrico em trilho. **Pilha:** TypeScript, Three.js, Vite e consulta WebXR no navegador.

A justificativa já registrada pelo grupo concentra o custo na manipulação direta: pegar, mover, orientar, encaixar e soltar componentes. As tolerâncias de posição e orientação precisam de teste; um limite permissivo faz a peça saltar ao destino e um restritivo impede o encaixe. A proposta escolhida acrescenta um desafio após a montagem: a peça presa continua ajustável em um eixo. O estado “preso ao trilho” precisa ser diferente do estado “livre”.

**Recorte atual:** declarações, sonda e demonstração da árvore em tela. O custo de referência é 16,67 ms por quadro, derivado da meta já declarada de 60 quadros/s. O estado final da montagem está especificado, mas ainda não é executável nesta etapa.

## 2. O que a pessoa faz ali

Na experiência final, a pessoa pega seis disjuntores e dois bornes sobre o apoio, orienta as garras em relação ao trilho, aproxima e solta. Uma peça presa pode deslizar somente no eixo local X do trilho, até ser desprendida de forma explícita. Os seis disjuntores precisam ficar alinhados antes da instalação do barramento. As chaves pertencem aos disjuntores.

No Módulo 03, os comandos de demonstração movem a placa, trocam o pai do disjuntor 1 e exibem a medição. Esses botões comprovam a estrutura que a manipulação futura consumirá; não executam a tarefa final.

No visor será necessário verificar escala, alcance e entradas. Em AR será necessário provar que o quadro permanece registrado sobre uma superfície real enquanto o observador se move. A proposta não é substituir a montagem elétrica real nem simular corrente ou dimensionar circuitos.

## 3. Inventário de objetos

| Objeto | Quantidade | Estado inicial no Módulo 03 | Origem atual |
| --- | ---: | --- | --- |
| Área de apoio | 1 | Sustenta os componentes e a placa | Caixa criada em código |
| Placa | 1 | Filha do apoio | Grupo e caixa |
| Trilho | 1 | Filho da placa | Grupo e caixa |
| Disjuntores | 6 | Soltos, filhos do apoio | Grupos de caixas |
| Bornes | 2 | Soltos, filhos do apoio | Grupos de caixas |
| Barramento | 1 | Solto, filho do apoio | Grupo de caixas |
| Indicador de conclusão | 1 | Filho da placa, desligado | Cilindro |

**13 objetos principais**, dos quais **9 são componentes manipuláveis no domínio**. Cada disjuntor contém corpo, entrada, saída, chave e encaixe. O borne contém corpo e encaixe; o barramento, corpo e contatos. As partes são nós filhos, não componentes soltos adicionais.

Auxiliares: 1 câmera, 2 luzes e 1 painel de medição com seu suporte. Contagem de objetos de domínio não equivale a chamadas de desenho ou triângulos; essas últimas são lidas do renderer.

## 4. O espaço e as escalas

Uma unidade da cena representa 1 metro. O eixo Y aponta para cima; X percorre o trilho; a frente da placa aponta para Z positivo.

| Objeto | Largura × altura × profundidade, em metros |
| --- | --- |
| Apoio | 0,80 × 0,03 × 0,60; topo a 0,80 do chão virtual |
| Placa | 0,50 × 0,40 × 0,012 |
| Trilho | 0,40 × 0,035 × 0,015 |
| Corpo de cada disjuntor | 0,018 × 0,080 × 0,070 |
| Corpo de cada borne | 0,020 × 0,040 × 0,040 |
| Corpo do barramento | 0,35 × 0,015 × 0,025 |
| Indicador | Raio 0,012; profundidade 0,009 |
| Painel informativo | 0,37 × 0,0925 |

A placa permanece vertical, apoiada junto à parte traseira da área horizontal. O centro local da placa é (0; 0,21; -0,15) em relação ao apoio. A cena atual usa escala uniforme 1:1; dimensões são criadas nas geometrias. A opção 1:2 para AR da especificação anterior fica adiada até teste, sem alterar a escala de referência do domínio.

## 5. As ações do usuário

| Ação | Resultado esperado | Situação nesta revisão |
| --- | --- | --- |
| Orbitar/aproximar | Inspecionar a cena por mouse ou toque | Implementado em tela |
| Mover placa | Trilho, indicador e painel acompanham a placa | Demonstração implementada |
| Trocar pai | Disjuntor 1 alterna entre apoio e trilho sem mudar a transformação mundial | Demonstração implementada |
| Reiniciar | Repõe a cena e limpa as medições locais | Implementado |
| Sondar VR/AR | Abre sessão temporária após clique, coleta dados e encerra | Implementado; depende do aparelho |
| Exportar medição | Salva JSON com aparelho, sonda, orçamento e trocas de pai | Implementado |
| Apanhar, orientar, soltar | Validar a tentativa de encaixe | Módulos seguintes |
| Ajustar no trilho / desprender | Distinguir movimento em um eixo de peça livre | Módulos seguintes |
| Instalar barramento | Verificar a dependência dos disjuntores alinhados | Módulos seguintes |

## 6. A tarefa e sua validação

**Tarefa:** montar o quadro encaixando os disjuntores e os bornes no trilho, alinhando os disjuntores e instalando o barramento por último.

**Estado inicial:** placa e trilho fixos; seis disjuntores, dois bornes e um barramento sobre o apoio; indicador desligado. “Mover placa” é um experimento da hierarquia, não uma ação da montagem final.

**Estado final previsto:** seis disjuntores e dois bornes montados, disjuntores alinhados e com as chaves ligadas, barramento instalado e indicador aceso. A validação será lógica e didática; não depende da expressão vaga “sem que os disjuntores desliguem”.

A ordem entre disjuntores é livre. O barramento pode ser apanhado antes, mas seu encaixe depende do alinhamento dos seis disjuntores. Isso corrige a versão anterior que bloqueava até a manipulação do barramento. Bornes também são necessários para concluir a tarefa.

No Módulo 03, trocar o pai não aproxima nem orienta a peça para um destino e não marca a montagem como concluída. O indicador permanece desligado.

## 7. Regras de encaixe e tolerâncias

Valores iniciais, não calibrados em hardware:

| Peça | Distância máxima provisória | Erro angular máximo provisório |
| --- | ---: | ---: |
| Disjuntor | 1,5 cm | 10° |
| Borne | 1,5 cm | 10° |
| Barramento | 1,0 cm | 8° |

Disjuntores e barramento preservam os valores da especificação recebida. O borne adota provisoriamente os valores do disjuntor nesta revisão; o grupo deve validar isso nos testes.

No módulo de encaixe, a distância será medida do ponto de referência da garra à projeção no trilho, nos eixos bloqueados. Após preso, o movimento só será permitido em X e dentro do comprimento útil de 0,40 m, descontada metade da largura da peça em cada ponta. Contato entre peças e alinhamento dos contatos do barramento ainda precisam de regra específica antes de implementar a conclusão.

Testar erros de posição de 0; 0,5; 1,0; 1,5 e 2,0 cm e erros angulares de 0; 5; 8; 10 e 15°. Os valores de fronteira devem ser incluídos; barramento antecipado, peça sobreposta e desprendimento também precisam de teste. Uma peça a 15° excederia o limite provisório de 10°. Esta regra está declarada; não foi implementada ou validada por usuários ainda.

Não há `SocketId`. O trilho e o estado futuro de montagem representarão a região de encaixe e a restrição de movimento, sem criar um ponto fixo obrigatório para cada componente.

## 8. Retorno ao usuário

Na revisão atual: relatório WebXR em tabela; árvore de nós; posição antes/depois e erro de reparentagem; texto de estado; painel de custo dentro da cena. O painel é filho da placa e não da câmera. Ele é atualizado a cada 0,25 s para evitar redesenhar o texto em todos os quadros.

Para a montagem futura: destaque de seleção, resposta distinta para erro de posição, ângulo e ordem, confirmação visual e textual do encaixe e indicador aceso somente na conclusão. Nenhum sinal pode depender exclusivamente de cor. Áudio ainda não foi incorporado.

## 9. Os três regimes

A tabela abaixo reproduz os campos de `webxr-app/src/quadro/modes/regimes.ts`, sem reescrever a declaração.

| Regime | Tratamento do mundo | Espaço de referência | O que rastreia | Registro |
| --- | --- | --- | --- | --- |
| Tela (`inline`) | Exibe o mundo virtual numa janela, sem alterar o mundo físico. | Coordenadas da cena; viewer se houver sessão XR inline. | Mouse/toque controla a câmera; não exige rastreamento corporal. | Origem virtual da área de apoio. |
| Visor / VR (`immersive-vr`) | Substitui a visão do ambiente por um mundo virtual. | local-floor pretendido; recuo para local com altura explícita se necessário. | Pose do observador e fontes de entrada efetivamente concedidas. | Chão do espaço rastreado; apoio a 0,80 m dele. |
| Câmera / AR (`immersive-ar`) | Preserva a visão do mundo físico e acrescenta o quadro virtual. | local; viewer apenas para lançar o raio de hit-test. | Pose do observador, entradas e superfícies se hit-test for concedido. | Superfície real escolhida; âncora se concedida. Escala inicial 1:1. |

**Implementado agora:** cena em tela por WebGL e consulta dos três modos XR. A janela WebGL não depende de `requestSession('inline')`. **Ainda previsto:** cena interativa no visor e registro persistente em AR. Os botões de sondagem não afirmam que essas experiências estão prontas.

A sonda observa até 60 quadros ou 6 s após preparar a sessão. O fechamento da sessão encerra a espera. A inferência usa poses em `local`, ou `local-floor` como alternativa; não deduz deslocamento usando o referencial `viewer`. Posição emulada durante toda a amostra pode significar 3 DoF ou perda de rastreamento de um aparelho de 6 DoF. Não identifica o formato físico do aparelho pela presença de AR.

## 10. Orçamento e desempenho

| Parâmetro | Valor e natureza |
| --- | --- |
| Teto em tela | 1000/60 = 16,67 ms; meta declarada, não resultado medido |
| Teto provisório VR | 1000/90 = 11,11 ms; previsto, sem sessão da cena implementada |
| Janela de medição | Últimos 120 quadros válidos |
| Atualização do painel | 4 vezes por segundo |
| Luzes | 2, sem sombras |
| Densidade de pixels | Limitada a 1,5 |
| Salto máximo de simulação | 0,1 s; o intervalo real continua disponível para medição |
| Animação de demonstração | Ângulo = sen(0,8 × tempo) × π/12; amplitude de 15° |

O custo cronometrado cobre a CPU e a submissão do desenho. O intervalo vem do timestamp entre callbacks; ele não mede diretamente o tempo de execução da GPU. A exportação registra os dois separadamente e conta intervalos acima do teto.

Ordem proposta para redução de custo nesta etapa: reduzir densidade de pixels de 1,5 para 1; reduzir frequência do texto de 4 para 2 Hz; agrupar geometrias repetidas, mantendo os nós do domínio; simplificar auxiliares. Não retirar componentes exigidos pela tarefa. Modelos e efeitos futuros deverão ser medidos antes de alterar esta ordem. As medições disponíveis ficam em `docs/aparelhos-testados.md` e `docs/evidencias/`.

## 11. Erros, limites e degradação

- Sem WebGL 2: mensagem de falha da cena; consulta de suporte XR continua separada.
- Sem contexto seguro: não concluir que o hardware não suporta XR; abrir por localhost ou HTTPS.
- API XR ausente ou modo não suportado: manter cena de tela e registrar a resposta.
- `NotAllowedError`/`SecurityError`: registrar permissão ou política bloqueada, incluindo a mensagem original. Não atribuir automaticamente a recusa à câmera.
- Recurso opcional fora de `enabledFeatures`: registrar **não concedido**, sem inventar se houve ausência ou negativa. Lista não exposta: **indeterminado**.
- Nenhuma fonte ou pose observada: registrar a amostra, sem afirmar incapacidade definitiva.
- Sessão temporária encerrada, sem quadros ou com erro: encerrar a coleta e liberar o contexto WebGL temporário.
- Escala zero, escala não uniforme em ancestrais ou tentativa de ciclo: recusar a troca de pai antes da alteração.
- Aba oculta: pausar o laço; ao voltar, reiniciar a medição para não misturar suspensão com desempenho contínuo.

Perda de rastreamento durante a manipulação e recuperação de âncoras continuam pendentes porque a cena imersiva ainda não é parte desta revisão.

## 12. Ativos, formatos e licença

| Ativo | Origem atual | Situação |
| --- | --- | --- |
| Placa, trilho, disjuntores, bornes, barramento, apoio e indicador | Primitivas de Three.js descritas em código do projeto, revisado com IA | Sem malha externa nesta etapa |
| Texto do painel | Canvas gerado em execução | Recurso informativo, sem textura decorativa importada |
| Imagens, áudio, modelos de controladores | Não utilizados | Nenhum download de ativo em execução |
| Three.js | Dependência npm `three` | MIT; licença acompanha o pacote |
| Código inicial e referência da disciplina | ZIP do grupo e ZIP do professor fornecidos para a revisão | Atribuição em `creditos.md`; licença de distribuição do material do professor não foi informada |

A proposta da cena exige que, na etapa de ativos, pelo menos os bornes e o barramento venham de arquivos de troca. Planejar GLB/glTF, registrar autor, URL, licença, conversão e escala. Nenhum modelo foi escolhido: essa seleção está pendente e não foi substituída por uma licença inventada.

## 13. Plano de construção por blocos

| Bloco | Resultado verificável | Situação |
| --- | --- | --- |
| Módulo 01 | Cena escolhida, domínio, três regimes, especificação em 14 seções | Atualizado nesta revisão |
| Módulo 02 | Consulta real da API, sessão temporária e relatório legível | Código implementado; validação em hardware XR pendente |
| Módulo 03 | Cena em metros, hierarquia, reparentagem numérica e orçamento no mundo | Implementado; evidências técnicas em `verificacao.md` |
| Modelagem/ativos | Arquivos dos bornes e barramento com licença e escala | Pendente |
| Manipulação | Apanhar, orientar, soltar e desprender; entradas por regime | Pendente |
| Encaixe | Tolerâncias, ajuste em X, limites e sobreposição | Pendente |
| Validação | Dependência do barramento, chaves e indicador | Pendente |
| VR/AR da cena | Alcance, superfícies, âncoras e recuperação | Pendente |

A entrega acadêmica também requer deck de sete slides, repositório com etiqueta `modulo-03`, demonstração por outra pessoa e teste em outra máquina. Esses atos não foram realizados pela revisão dos arquivos.

## 14. Riscos, decisões em aberto e declarações

### Alterações desta revisão e seus motivos técnicos

| Antes | Agora | Motivo da correção |
| --- | --- | --- |
| Cinco cubos na aplicação; código paralelo de engrenagens | Uma única cena do quadro e pasta `src/quadro` | A aplicação precisa desenhar os objetos do domínio |
| Seis disjuntores na especificação e três registros no domínio | Seis disjuntores com IDs próprios | Fazer código e especificação concordarem |
| Vários componentes identificados como `corpo` | ID da instância separado de suas partes | Evitar colisão de identificadores |
| Tipo `Chave` ausente e `chave: false` incompatível | Chave como nó filho do disjuntor | Representar a parte existente no objeto; estado liga/desliga é etapa futura |
| Bornes omitidos da especificação | Dois bornes, entrada e saída | A proposta escolhida inclui bornes; quantidade inicial explicitada nesta revisão |
| “Eixo vertical” como um segundo trilho | Um trilho com eixo local X | Eixo de coordenadas não é outro objeto físico |
| Grau de liberdade deduzido de espaço concedido | Inferência conservadora a partir de poses | Espaço de referência não comprova rastreamento posicional |
| Recurso opcional ausente da lista tratado como negado | Não concedido, causa desconhecida | Não atribuir à permissão o que a API não explicou |
| Indicador de custo desconectado do ponto de entrada | Painel visível, filho da placa | Tornar a medição verificável na cena |
| Especificação em caminho diferente do exigido | `docs/especificacao.md` | Atender o caminho pedido e reduzir ambiguidade |

Esses são motivos da revisão técnica. Não são um relato inventado de alternativas discutidas pelo grupo. O grupo deve validar a proposta e registrar as decisões que realmente assumir.

### Pendências e riscos concretos

Calibrar tolerâncias em hardware; definir espaçamento/alinhamento do barramento e sobreposição; testar legibilidade no visor; escolher ativos com licença; confirmar escala de AR; medir máquinas do grupo e do laboratório. A tabela de aparelhos não pode transformar um teste automatizado em teste físico.

### Uso de IA

Em 27/09/2026, ChatGPT/Codex foi usado para revisar os arquivos enviados e executar verificações automatizadas. As alterações e limites estão no diário.
