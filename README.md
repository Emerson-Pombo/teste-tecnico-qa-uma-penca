# Teste Técnico QA

## Visão Geral

Este projeto foi desenvolvido como parte do teste técnico para a posição de Analista de Qualidade de Software (QA).
O objetivo foi validar a funcionalidade de criação, edição e exibição de produtos, garantindo qualidade ponta a ponta por meio de testes funcionais, automatizados e de API, seguindo boas práticas de engenharia de software e qualidade.

(As respostas detalhadas para as perguntas propostas no teste técnico podem ser encontradas no arquivo [respostas.md])

## 1 - Como pensei os testes?

A estratégia de testes foi definida considerando valor de negócio, risco e impacto ao usuário final.

Primeiramente, analisei a funcionalidade sob a ótica do usuário e do sistema, entendendo quais fluxos são críticos para o funcionamento da aplicação. A partir disso, defini os cenários de teste cobrindo:

- Regras de negócio (ex.: campos obrigatórios, preço válido, status do produto)

- Integração entre frontend e backend

- Persistência e recuperação correta dos dados

- Exibição correta das informações no catálogo

A abordagem adotada combinou diferentes níveis de teste:

- Testes de API, para validar regras de negócio, contratos, autenticação, códigos de retorno e cenários negativos de forma mais rápida e isolada.

- Testes automatizados E2E, simulando o comportamento real do usuário, garantindo que os fluxos principais funcionem corretamente da autenticação até a visualização no catálogo.

Para automação, utilizei Playwright com TypeScript e Page Objects, visando organização, reutilização de código e facilidade de manutenção.
Os testes foram pensados para serem independentes e legíveis, evitando dependência de massa fixa e favorecendo execução em pipelines de CI/CD.

## 2 - O que priorizei?

Durante a execução do teste, priorizei:

- Fluxos críticos do negócio, como criação e edição de produtos, pois impactam diretamente a operação e a experiência do usuário.

- Cenários positivos essenciais, garantindo que a funcionalidade principal funciona conforme esperado.

- Cenários negativos de alto risco, como ausência de campos obrigatórios, valores inválidos e falta de autenticação.

- Validação da integração frontend x backend, assegurando que dados criados via API ou interface sejam refletidos corretamente no catálogo.

- Automação de testes de regressão, focando em cenários que tendem a quebrar com frequência em evoluções futuras.

- Também priorizei uma estrutura de projeto organizada, uso de boas práticas (Page Objects, separação de responsabilidades, commits semânticos) e documentação clara, pensando na manutenção e escalabilidade do projeto.

## 3 - O que eu faria com mais tempo ?

Com mais tempo disponível, eu evoluiria o projeto com as seguintes melhorias:

- Implementaria testes de contrato de API (ex.: usando JSON Schema) para garantir estabilidade na comunicação entre serviços.

- Ampliaria a cobertura de testes de performance e carga, especialmente nos endpoints de listagem e catálogo.

- Integraria totalmente os testes automatizados em um pipeline de CI/CD, com geração de relatórios e bloqueio de deploy em caso de falhas.

- Criaria uma estratégia mais robusta de gerenciamento de massa de dados, isolando completamente ambientes e evitando interferência entre execuções.

- Adicionaria testes visuais para validar layout e responsividade do catálogo.

- Evoluiria métricas de qualidade, como taxa de falhas, cobertura de testes e tempo médio de execução.

### Considerações Finais

O foco deste teste foi demonstrar uma visão prática de qualidade, tratando QA como parte do processo de desenvolvimento e não como uma etapa final.
As decisões tomadas nesse desafio foram feitas para equilibrar qualidade e valor de negócio. Acredito que a abordagem adotada, combinando testes de API e E2E, é eficaz para garantir uma cobertura abrangente e uma validação realista da funcionalidade, ao mesmo tempo em que mantém o projeto organizado e sustentável a longo prazo.
