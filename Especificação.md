# Especificação do Projeto --- Quadro Elétrico em Trilho

## 1. Identificação do grupo e da cena

**Grupo 8**

**Integrantes:** Fábio Henrique Miguel Silva, Luís Fernando Kameda Carvajhal, Pedro Henrique Barbosa, João Guilhermo Sabongi

**Cena escolhida:** Quadro elétrico em trilho

**Descrição em uma frase:** Ambiente tridimensional no qual a pessoa monta um pequeno quadro elétrico encaixando disjuntores em um trilho e, ao final, posicionando o barramento para concluir a montagem.

**Por que esta cena foi escolhida:** A cena foi escolhida porque concentra o desafio do projeto na manipulação direta de objetos
tridimensionais, principalmente em pegar, mover, orientar, encaixar e
soltar peças. O principal custo técnico esperado está na definição e no
teste das regras de encaixe, especialmente nas tolerâncias de posição e
de orientação.

**Armadilha principal:** O encaixe pode ficar permissivo demais, fazendo
a peça "pular" para o lugar, ou restritivo demais, tornando a montagem
difícil de executar. A tolerância será inicialmente definida por valores
provisórios e ajustada após testes no aparelho.

------------------------------------------------------------------------

## 2. O que a pessoa faz ali

A pessoa inicia diante de um quadro elétrico apoiado em uma superfície.
Os componentes necessários para a montagem ficam próximos ao quadro. O
objetivo é pegar cada disjuntor, aproximá-lo do trilho, alinhar sua
orientação e soltá-lo na posição correta. Quando todos os disjuntores
estiverem encaixados de forma válida, o barramento ficará disponível
para a etapa seguinte. A pessoa então pega o barramento, posiciona-o no
local correspondente e o solta. Quando todas as condições da montagem
forem satisfeitas, o sistema indica que o quadro foi concluído.

A interação principal acontece por manipulação dos objetos, e não por
menus. A pessoa precisa distinguir visualmente uma peça que pode ser
pega, uma peça que está sendo manipulada, uma posição válida de encaixe
e uma tentativa recusada.

**O que se faz com as mãos:** A pessoa aponta para os componentes, pega
os disjuntores e o barramento, movimenta cada peça, orienta a peça em
relação ao trilho ou ao encaixe correspondente e a solta para confirmar
a montagem.

**O que muda com o visor:** No regime de visor, a pessoa poderá observar
o quadro em escala tridimensional e manipular as peças usando as fontes
de entrada disponíveis no dispositivo. O rastreamento da posição e da
orientação permitirá que a montagem seja realizada enquanto a pessoa se
movimenta ao redor da cena.

**O que a câmera precisa provar:** No regime de câmera, o quadro deverá
permanecer ancorado sobre uma superfície real detectada pelo aparelho. A
câmera deverá ser usada para identificar a superfície e manter a posição
do quadro enquanto a pessoa muda de posição, em vez de servir apenas
como fundo visual.

------------------------------------------------------------------------

## 3. Inventário de objetos

  ---------------------------------------------------------------------------------
  Objeto                        Quantos Origem        Move?         Observação
  ------------------- ----------------- ------------- ------------- ---------------
  Placa de montagem                   1 Construída    Não           Base fixa do
                                        pelo grupo                  quadro

  Trilho metálico                     1 Modelo 3D     Não           Define o eixo
                                        importado ou                principal de
                                        construído                  encaixe dos
                                        com geometria               disjuntores
                                        simples                     

  Disjuntor                           6 Modelo 3D     Sim           Peças
                                        importado                   manipuláveis;
                                                                    inicialmente
                                                                    iguais,
                                                                    diferenciadas
                                                                    pela posição de
                                                                    montagem

  Barramento                          1 Modelo 3D     Sim           Só pode ser
                                        importado                   encaixado
                                                                    depois dos
                                                                    disjuntores

  Indicador de                        1 Construído    Não           Permanece
  conclusão                             pelo grupo                  apagado até a
                                                                    montagem estar
                                                                    correta

  Área de apoio                       1 Construída    Não           Superfície de
                                        pelo grupo                  referência da
                                                                    cena

  Elementos de               1 conjunto Construídos   Não           Usados para
  destaque/feedback                     pelo grupo                  indicar mira,
                                                                    encaixe válido,
                                                                    recusa e
                                                                    conclusão
  ---------------------------------------------------------------------------------

A quantidade inicial prevista é de **10 objetos principais**, sem contar
elementos auxiliares de iluminação, câmera, controladores, retículos e
outros elementos necessários ao funcionamento do ambiente.

A origem dos modelos de terceiros deverá ser registrada na Seção 12
assim que os arquivos definitivos forem escolhidos. Nenhum ativo de
terceiros será considerado definitivamente aprovado enquanto sua licença
e origem não estiverem registradas.

------------------------------------------------------------------------

## 4. O espaço e as escalas

A cena será projetada inicialmente em **escala real**, com dimensões
compatíveis com um pequeno quadro elétrico de bancada.

**Dimensões provisórias da cena:**

-   Placa: aproximadamente **0,50 m de largura × 0,40 m de altura**.
-   Trilho: aproximadamente **0,40 m de comprimento**.
-   Disjuntor: aproximadamente **0,018 m de largura × 0,080 m de altura
    × 0,070 m de profundidade** por unidade.
-   Barramento: aproximadamente **0,35 m de comprimento**.
-   Área de apoio: aproximadamente **0,80 m × 0,60 m**.

As dimensões acima são valores iniciais para permitir que a lógica de
posicionamento e encaixe seja definida antes dos testes físicos. As
medidas poderão ser ajustadas caso os modelos 3D escolhidos apresentem
proporções diferentes, mas a escala relativa entre os componentes deverá
ser preservada.

A cena ficará apoiada sobre uma superfície horizontal.

### Escala reduzida

No regime de câmera, a cena poderá ser apresentada em uma escala
reduzida sobre uma mesa real. A referência inicial será uma redução
aproximada de **1:2**, desde que essa escala permita que o quadro
continue suficientemente grande para a manipulação e para a leitura dos
retornos visuais.

### Escala em tamanho real

No regime de visor, a cena será apresentada preferencialmente em escala
real. A posição da pessoa deverá permitir que ela alcance os componentes
sem precisar executar movimentos excessivamente amplos.

------------------------------------------------------------------------

## 5. As ações do usuário

  -----------------------------------------------------------------------
  Ação              O que a pessoa    O que o sistema   Se não puder
                    faz               faz               
  ----------------- ----------------- ----------------- -----------------
  Apontar           Mira para uma     Destaca           Não destaca
                    peça              visualmente a     nenhum objeto
                                      peça que pode ser 
                                      selecionada       

  Apanhar           Aciona a seleção  O componente      Informa que a
                    sobre um          passa a           peça não pode ser
                    componente        acompanhar a      apanhada
                                      fonte de entrada  

  Mover             Desloca a peça    Mantém a peça     Mantém a peça no
                    pela cena         acompanhando a    último estado
                                      mão ou            válido
                                      controlador       

  Orientar          Gira o componente Permite a mudança Indica
                    para alinhá-lo ao de orientação     visualmente que o
                    encaixe           durante a         ângulo ainda não
                                      manipulação       é válido

  Soltar            Libera o          Verifica posição  Recusa o encaixe
                    componente        e orientação e    e informa o
                    próximo ao local  decide se o       motivo
                    de destino        encaixe é válido  

  Reposicionar      Tenta encaixar    Permite uma nova  Mantém a peça
                    novamente uma     tentativa         disponível para
                    peça recusada                       nova tentativa

  Encaixar o        Após os           Verifica a        Informa que os
  barramento        disjuntores,      condição de       disjuntores ainda
                    posiciona o       conclusão dos     não estão prontos
                    barramento        disjuntores e o   
                                      encaixe do        
                                      barramento        

  Concluir          Realiza           Acende o          Não ativa o
                    corretamente a    indicador e       indicador
                    última etapa      informa que a     
                                      montagem foi      
                                      concluída         
  -----------------------------------------------------------------------

A lista prioriza ações de manipulação física dos objetos. Menus e botões
de interface não fazem parte das ações principais da tarefa.

------------------------------------------------------------------------

## 6. A tarefa e sua validação

### Estado inicial

No início:

-   a placa está fixa;
-   o trilho está fixo na placa;
-   os seis disjuntores estão fora do trilho e disponíveis para
    manipulação;
-   o barramento está fora do seu encaixe;
-   o indicador de conclusão está desligado;
-   nenhuma etapa da montagem é considerada concluída.

### Ordem da tarefa

A ordem será **rígida**:

1.  Os seis disjuntores devem ser encaixados no trilho.
2.  Cada disjuntor precisa estar em uma posição e orientação válidas.
3.  Depois que todos os disjuntores estiverem válidos, o barramento
    poderá ser manipulado.
4.  O barramento deverá ser encaixado em sua posição correspondente.
5.  Quando todas as condições forem verdadeiras, o indicador de
    conclusão será ativado.

A ordem dos seis disjuntores entre si será inicialmente **livre**.
Portanto, qualquer um dos seis poderá ser encaixado primeiro, desde que
seja colocado em uma posição válida. O que não poderá acontecer é o
barramento ser encaixado antes de todos os disjuntores estarem
corretamente posicionados.

### Estado final

A tarefa será considerada concluída quando:

-   os seis disjuntores estiverem encaixados;
-   cada disjuntor estiver dentro da tolerância de posição;
-   cada disjuntor estiver dentro da tolerância angular;
-   nenhum disjuntor estiver fora do trilho;
-   o barramento estiver encaixado dentro de sua tolerância;
-   a condição de montagem estiver consistente;
-   o indicador de conclusão estiver ligado.

O sistema não deverá considerar a tarefa concluída apenas porque as
peças estão visualmente próximas. A validação deverá depender das regras
de posição, orientação e ordem estabelecidas nesta especificação.

------------------------------------------------------------------------

## 7. Regras de encaixe e tolerâncias

Os valores abaixo são **provisórios** e serão usados como ponto de
partida para os testes no aparelho.

### Disjuntores no trilho

  Tipo de encaixe        Folga de posição   Folga de ângulo
  -------------------- ------------------ -----------------
  Disjuntor → trilho         **± 1,5 cm**         **± 10°**

O disjuntor será aceito quando estiver dentro da região de encaixe
correspondente ao trilho e quando sua orientação estiver dentro da
tolerância angular.

Uma tolerância de posição muito grande faria com que a peça fosse
atraída para o lugar mesmo quando estivesse claramente fora do encaixe.
Uma tolerância muito pequena exigiria precisão excessiva da pessoa,
principalmente no visor e na câmera.

A tolerância angular inicial de 10° busca permitir pequenas imprecisões
naturais do movimento sem transformar uma peça inclinada em uma peça
corretamente montada.

### Barramento

  Tipo de encaixe                Folga de posição   Folga de ângulo
  ---------------------------- ------------------ -----------------
  Barramento → posição final         **± 1,0 cm**          **± 8°**

O barramento terá tolerância um pouco menor porque representa a etapa
final da montagem e deverá deixar claro que a posição correta foi
alcançada.

### Testes previstos

Os valores provisórios serão testados pelo menos nas seguintes
condições:

-   encaixe exatamente no centro;
-   posição 0,5 cm fora;
-   posição 1,0 cm fora;
-   posição 1,5 cm fora;
-   posição 2,0 cm fora;
-   orientação 5° fora;
-   orientação 10° fora;
-   orientação 15° fora;
-   peça errada no local;
-   barramento antes da conclusão dos disjuntores.

Os resultados serão registrados e poderão alterar os valores da
especificação. A versão final deverá registrar a tolerância escolhida e
o motivo da alteração, caso os testes mostrem que os valores iniciais
são inadequados.

------------------------------------------------------------------------

## 8. Retorno ao usuário

O ambiente deverá fornecer retorno visual e, quando disponível e
adequado, sonoro.

  -----------------------------------------------------------------------
  Situação                            Retorno
  ----------------------------------- -----------------------------------
  Objeto sob a mira                   Contorno ou destaque visual

  Objeto sendo apanhado               Destaque persistente enquanto
                                      estiver sendo manipulado

  Posição de encaixe válida           Indicação visual do local de
                                      destino

  Peça alinhada corretamente          Indicação de encaixe disponível

  Encaixe aceito                      Peça muda para o estado visual de
                                      montada e deixa de acompanhar a mão

  Ângulo incorreto                    Indicação de erro de orientação

  Posição incorreta                   Indicação de erro de posição

  Peça errada                         Mensagem informando que aquela peça
                                      não corresponde ao encaixe

  Barramento bloqueado                Mensagem indicando que os
                                      disjuntores ainda não foram
                                      concluídos

  Barramento encaixado                Indicação visual de montagem
                                      concluída da etapa

  Tarefa concluída                    Indicador do quadro acende e
                                      aparece uma confirmação de
                                      conclusão

  Rastreamento perdido                Indicação clara de que a interação
                                      foi temporariamente interrompida
  -----------------------------------------------------------------------

O retorno não dependerá exclusivamente de texto. No visor, os sinais
visuais deverão ser suficientemente claros para que a pessoa consiga
compreender o estado do objeto sem precisar ler uma mensagem pequena.

------------------------------------------------------------------------

## 9. Os três regimes

  ---------------------------------------------------------------------------
  Aspecto           Na tela           No visor            Pela câmera
  ----------------- ----------------- ------------------- -------------------
  Como se olha      Câmera controlada Visão               Visão do ambiente
                    pelo computador   estereoscópica do   real com a cena
                                      ambiente virtual    virtual sobreposta

  Como se aponta e  Mouse e/ou        Controladores XR ou Toque/controlador
  age               controles         outra fonte de      compatível com a
                    disponíveis na    entrada reconhecida sessão AR
                    aplicação         pelo aparelho       

  Escala da cena    Escala virtual    Preferencialmente   Escala reduzida
                    confortável para  escala real         sobre uma mesa real
                    visualização na                       
                    janela                                

  O que a cena faz  Serve como regime Permite observar e  Usa a câmera e o
  de diferente      base para testar  manipular o quadro  rastreamento para
                    a lógica sem      em espaço           posicionar o quadro
                    equipamento XR    tridimensional      sobre uma
                                      imersivo            superfície real

  O que não existe  Não existe        Não existe visão    Não existe
  neste regime      rastreamento      direta obrigatória  substituição
                    imersivo de       do ambiente físico  completa do mundo
                    cabeça e mãos                         físico por um mundo
                    como requisito da                     virtual
                    experiência                           
  ---------------------------------------------------------------------------

A implementação atual do projeto já possui uma base WebXR que consulta
os regimes `inline`, `immersive-vr` e `immersive-ar`, além de sondar
recursos opcionais, espaços de referência, fontes de entrada e
estabilidade de rastreamento. A especificação do quadro utilizará essa
base como infraestrutura, mas a cena final deverá substituir os objetos
de demonstração pelos componentes do quadro elétrico.

### Regime de tela

O regime de tela será o caso base. A aplicação deverá permitir que a
lógica principal da montagem seja testada sem depender de um visor XR.

### Regime de visor

O regime de visor será usado para explorar a manipulação tridimensional
com rastreamento de posição e orientação. A aplicação deverá aproveitar
as fontes de entrada que o aparelho efetivamente disponibilizar.

### Regime de câmera

O regime de câmera será usado para colocar o quadro sobre uma superfície
real. O projeto atual já possui uma base de `hit-test` para detectar
superfícies e posicionar um retículo no ponto detectado. Essa capacidade
será utilizada como fundamento para a implantação do quadro na
superfície real.

------------------------------------------------------------------------

## 10. Orçamento e desempenho

A cena deverá permanecer suficientemente fluida para que a manipulação
seja confortável, especialmente no visor.

### Orçamento inicial

-   Objetos principais: **10**.
-   Disjuntores repetidos: **6**.
-   Luzes principais: até **3**.
-   Materiais principais: preferencialmente reutilizados entre objetos
    equivalentes.
-   Texturas: somente quando contribuírem para a identificação dos
    componentes.
-   Modelos: priorizar geometrias de baixa ou média complexidade.

O número de objetos é pequeno de propósito. O maior risco de custo não
está na quantidade de componentes, mas no detalhamento dos modelos
importados, texturas e efeitos utilizados.

### Meta de fluidez

A meta inicial será manter aproximadamente **60 quadros por segundo** no
regime de tela quando o aparelho permitir e buscar uma experiência
estável no visor e na câmera, evitando quedas perceptíveis durante a
manipulação.

O valor final será confrontado com as máquinas disponíveis no
laboratório.

### Ordem de degradação

Se a cena não atingir o desempenho esperado, a redução seguirá esta
ordem:

1.  reduzir o detalhe geométrico dos modelos;
2.  reduzir ou remover texturas de objetos secundários;
3.  simplificar iluminação e efeitos;
4.  reduzir elementos decorativos;
5.  reduzir a quantidade de elementos auxiliares não essenciais;
6.  somente por último alterar a quantidade de objetos principais da
    tarefa.

Os seis disjuntores e o barramento não serão removidos, pois são parte
essencial da experiência.

------------------------------------------------------------------------

## 11. Erros, limites e degradação

### O aparelho não suporta o regime solicitado

Se o navegador não suportar o regime de VR ou AR solicitado, a aplicação
deverá informar que o recurso não está disponível e permitir a
utilização do regime de tela.

A base atual já consulta `inline`, `immersive-vr` e `immersive-ar` e
apresenta o suporte declarado pelo aparelho antes da utilização da
sessão.

### A permissão de câmera é negada

Se a pessoa negar a câmera, o regime AR não deverá abrir uma tela vazia.
A aplicação deverá informar que a câmera é necessária para o regime de
câmera e oferecer o regime de tela como alternativa.

### O rastreamento se perde

Se o rastreamento perder a pose ou a superfície deixar de ser
identificada:

-   a peça que estiver sendo manipulada não deverá ser considerada
    automaticamente encaixada;
-   a interação deverá ser temporariamente interrompida;
-   o estado já validado da montagem deverá ser preservado;
-   a aplicação deverá informar que o rastreamento precisa ser
    recuperado;
-   após a recuperação, a pessoa poderá continuar a montagem.

A base atual já possui uma sondagem de estabilidade que observa quadros
com e sem pose, permitindo utilizar essa informação no diagnóstico do
aparelho.

### A pessoa sai do espaço útil

Se a pessoa tentar alcançar uma peça fora de uma distância prática:

-   a peça não deverá ser movida para uma posição impossível;
-   a aplicação deverá permitir que a pessoa se reposicione;
-   no visor, o sistema deverá evitar exigir alcance excessivo;
-   no regime de câmera, a cena deverá continuar ancorada enquanto o
    rastreamento permanecer válido.

### Tentativa de encaixe inválida

Uma tentativa inválida não deverá destruir o estado da montagem. A peça
permanecerá disponível para nova tentativa e o sistema indicará se o
problema foi posição, orientação, peça incorreta ou ordem da tarefa.

------------------------------------------------------------------------

## 12. Ativos, formatos e licença

A definir se será utilizado.

------------------------------------------------------------------------

## 13. Plano de construção por blocos

O projeto deverá crescer em blocos, mantendo uma versão executável ao
final de cada etapa.

### Bloco 1 --- Base WebXR e sondagem

**Ao final:** a aplicação abre, verifica o contexto, identifica os
regimes disponíveis e apresenta o relatório das capacidades do aparelho.

A base atual já possui:

-   suporte a `inline`;
-   sondagem de `immersive-vr`;
-   sondagem de `immersive-ar`;
-   consulta de recursos opcionais;
-   consulta de espaços de referência;
-   leitura das fontes de entrada;
-   classificação aproximada do aparelho;
-   observação de estabilidade do rastreamento.

### Bloco 2 --- Cena básica do quadro

**Ao final:** a placa, o trilho, os seis disjuntores, o barramento e o
indicador aparecem em uma cena 3D executável.

Os objetos de demonstração atualmente presentes na cena deverão ser
substituídos pelos componentes da cena escolhida.

### Bloco 3 --- Manipulação dos componentes

**Ao final:** a pessoa consegue apontar, pegar, mover e soltar os
disjuntores e o barramento.

A base atual já possui interação com controladores XR por meio de
seleção, além de destaque do objeto sob a mira. Essa lógica será
adaptada aos componentes do quadro.

### Bloco 4 --- Encaixe e tolerâncias

**Ao final:** o sistema diferencia encaixes válidos e inválidos usando
as tolerâncias definidas na Seção 7.

Deverão ser implementadas as verificações de posição e orientação para
os disjuntores e para o barramento.

### Bloco 5 --- Ordem e validação da montagem

**Ao final:** o barramento fica bloqueado até que os seis disjuntores
estejam corretamente montados e o indicador só acende quando todas as
condições forem satisfeitas.

### Bloco 6 --- Regime de câmera

**Ao final:** o quadro pode ser posicionado sobre uma superfície real
detectada pela câmera e permanece ancorado enquanto o rastreamento
estiver funcionando.

A base atual de `hit-test` será utilizada como ponto de partida para
essa etapa.

### Bloco 7 --- Feedback e tratamento de erros

**Ao final:** o usuário recebe retorno diferente para seleção,
manipulação, encaixe válido, encaixe recusado, bloqueio de etapa,
conclusão e perda de rastreamento.

### Bloco 8 --- Otimização e testes finais

**Ao final:** a aplicação será testada nas máquinas disponíveis, os
modelos serão simplificados se necessário e as tolerâncias serão
ajustadas com base nos testes.

------------------------------------------------------------------------

## 14. Riscos, decisões em aberto e declarações

### Riscos

  -----------------------------------------------------------------------
  Risco                   Consequência            Ação
  ----------------------- ----------------------- -----------------------
  Modelo 3D dos           Queda de desempenho     Usar modelos de menor
  componentes muito                               complexidade e reduzir
  pesado                                          detalhes

  Tolerância muito        Encaixe difícil         Aumentar gradualmente a
  pequena                                         tolerância após os
                                                  testes

  Tolerância muito grande Encaixe automático ou   Reduzir a tolerância e
                          impreciso               repetir os testes

  Rastreamento instável   Peças parecem deslocar  Testar diferentes
                          ou perder a posição     superfícies e condições
                                                  de iluminação

  AR não suportado no     Regime de câmera        Manter regime de tela
  aparelho                indisponível            como alternativa

  Controle de entrada     Manipulação             Usar a sondagem de
  diferente entre         inconsistente           fontes de entrada antes
  aparelhos                                       dos testes

  Modelos importados sem  Problema de             Registrar fonte e
  licença clara           documentação            licença antes da
                                                  incorporação

  Cena pesada para as     Experiência pouco       Aplicar a ordem de
  máquinas do laboratório fluida                  degradação definida na
                                                  Seção 10

  Escala inadequada no AR Manipulação difícil     Testar a escala
                                                  reduzida sobre uma mesa

  Encaixe sem distinção   Comportamento incorreto Separar claramente os
  entre pegar e soltar    da montagem             estados de manipulação
                                                  e validação
  -----------------------------------------------------------------------

### Decisões em aberto

  -----------------------------------------------------------------------
  Decisão                             Como será definida
  ----------------------------------- -----------------------------------
  Modelo 3D definitivo do disjuntor   Comparação entre modelos
                                      disponíveis e teste de desempenho

  Modelo 3D definitivo do trilho      Avaliação visual, escala e licença

  Modelo 3D definitivo do barramento  Avaliação visual, escala e licença

  Tolerância final dos disjuntores    Testes práticos no aparelho

  Tolerância final do barramento      Testes práticos no aparelho

  Escala final do AR                  Teste sobre mesa real

  Meta de desempenho final            Teste nas máquinas disponíveis no
                                      laboratório

  Forma definitiva do feedback sonoro Teste de utilidade e
                                      compatibilidade

  Estratégia final de ancoragem no AR Teste com os recursos efetivamente
                                      concedidos pelo aparelho
  -----------------------------------------------------------------------

### Declaração de uso de ferramentas de inteligência artificial

Ferramentas de inteligência artificial foram utilizadas como apoio à
organização e à redação inicial desta especificação e à análise da
estrutura do projeto. As decisões referentes à cena, às regras de
interação, às tolerâncias, aos objetos, aos regimes de uso, aos testes e
ao planejamento de construção deverão ser revisadas e validadas pelos
integrantes do grupo.

O grupo é responsável por compreender, testar e ajustar tudo o que for
incorporado ao projeto, especialmente os valores de tolerância,
desempenho, compatibilidade dos aparelhos, origem dos ativos e
comportamento da experiência nos três regimes.
