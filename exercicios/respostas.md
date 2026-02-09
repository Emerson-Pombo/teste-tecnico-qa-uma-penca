## 1- Entendimento de funcionalidade

1. Cenários de teste funcionais (positivos e negativos)
2. Casos de borda que você considera importantes
3. O que você validaria no frontend e no backend

   | Cenario                                    | Tipo     |
   | ------------------------------------------ | -------- |
   | Criar produto com todos os campos válidos  | Positivo |
   | Editar produto existente com sucesso       | Positivo |
   | Criar produto com status ativo             | Positivo |
   | Criar produto com status inativo           | Positivo |
   | Validar exibição correta no catálogo       | Positivo |
   | Validar atualização imediata após edição   | Positivo |
   | Criar produto com preço decimal válido     | Positivo |
   | Editar apenas um campo mantendo os demais  | Positivo |
   | Criar produto sem nome                     | Negativo |
   | Criar produto sem preço                    | Negativo |
   | Criar produto com preço negativo           | Negativo |
   | Criar produto com preço igual a zero       | Negativo |
   | Enviar descrição acima do limite permitido | Negativo |
   | Criar produto sem autenticação             | Negativo |
   | Enviar status inválido                     | Negativo |
   | Tentar editar produto inexistente          | Negativo |
   | Nome com caracteres especiais              | Borda    |
   | Nome muito longo                           | Borda    |
   | Preço com muitas casas decimais            | Borda    |
   | Preço muito alto                           | Borda    |
   | Descrição vazia                            | Borda    |
   | Edição simultânea por dois usuários        | Borda    |
   | Mudança de status e validação no catálogo  | Borda    |
   | Campos com espaços em branco               | Borda    |
   | Validações de obrigatoriedade              | Frontend |
   | Mensagens de erro tela                     | Frontend |
   | Bloqueio de envio com campos inválidos     | Frontend |
   | Atualização em tempo real após edição      | Frontend |
   | Exibição correta do status                 | Frontend |
   | Validação de regras de negócio             | Backend  |
   | Autenticação                               | Backend  |
   | Formato dos dados                          | Backend  |
   | Retornos HTTP corretos                     | Backend  |
   | Persistência correta no banco              | Backend  |
   | Tratamento de erros                        | Backend  |

## 2 – Estratégia de Testes de Integração

Endpoints analisados:

- POST /api/products
- PUT /api/products/{id}
- GET /api/products/{id}

Para testar essa API adoraria uma estratégia que envolvesse os seguintes pontos:

1. **Configuração do Ambiente de Teste**:
   - Utilizar um ambiente isolado para testes, com um banco de dados dedicado que possa ser resetado entre os testes.
   - Configurar variáveis de ambiente específicas para testes, como URLs, credenciais e tokens de autenticação.
   - validaria contratos de API utilizando ferramentas como Swagger ou Postman para garantir que a documentação esteja alinhada com a implementação.
   - Regras de negócio específicas, como limites de preço ou formatos de nome, seriam validadas para garantir conformidade.
   - Autenticação e autorização seriam testadas para garantir que apenas usuários válidos possam acessar os endpoints.
   - Cenarios positivos e negativos seriam criados para cada endpoint, cobrindo todas as funcionalidades esperadas.
   - Retornos HTTP seriam verificados para garantir que os códigos de status estejam corretos.
   - Dados persistidos no banco de dados seriam validados para garantir que as operações CRUD estejam funcionando corretamente.
2. **Validação de payload**:
   - Garantir que os payloads enviados estejam no formato correto (JSON) e contenham todos os campos obrigatórios.
   - Validar tipos de dados, tamanhos máximos e formatos específicos (ex: preço decimal).
     Exemplo do payload para criação de produto valido:

```json
{
  "name": "Produto Exemplo",
  "description": "Descrição do produto exemplo",
  "price": 99.99,
  "status": "active"
}
```

Exemplo do payload para edição de produto valido:

```json
{
  "name": "Produto Exemplo Editado",
  "description": "Descrição atualizada do produto exemplo",
  "price": 89.99,
  "status": "inactive"
}
```

exemplo do payload inválido (preço negativo):

```json
{
  "name": "Produto Inválido",
  "description": "Descrição do produto inválido",
  "price": -10.0,
  "status": "active"
}
```

exeplo de retorno esperado para criação de produto com sucesso:

```json
{
  "id": "12345",
  "name": "Produto Exemplo",
  "description": "Descrição do produto exemplo",
  "price": 99.99,
  "status": "active",
  "createdAt": "2024-01-01T12:00:00Z",
  "updatedAt": "2024-01-01T12:00:00Z"
}
```

exemplo de retorno esperado para erro de validação:

```json
{
  "error": "Invalid price value. Price must be a positive number."
}
```

Em cada camada seria validado os seguintes pontos:

- **Requests**: Verificar se os requests estão sendo enviados corretamente com os headers apropriados (Content-Type, Authorization, etc.).
- **Responses**: Validar os códigos de status HTTP retornados (200, 201, 400, 401, 404, 500, etc.) e o conteúdo do corpo da resposta.
- **Regras de Negócio**: Garantir que as regras de negócio estejam sendo aplicadas corretamente, como limites de preço, formatos de nome, etc.
- **Segurança**: Testar autenticação e autorização para garantir que apenas usuários válidos possam acessar os endpoints.
- **Persistência de Dados**: Verificar se os dados estão sendo corretamente salvos, atualizados e recuperados do banco de dados.

## 3 - Automação de testes backend

- Setup:
  - Criar usuário autenticado
  - COnfigurar ambiente de teste
  - Criar massa de dados

- Execução dos testes:
  - Testar criação de produto com dados válidos
  - Testar criação de produto com dados inválidos
  - Testar edição de produto existente
  - Testar edição de produto inexistente
  - Testar recuperação de produto por ID
  - Validar respostas HTTP e conteúdo retornado

Validação dos resultados: - Verificar códigos de status HTTP - Validar conteúdo das respostas - Confirmar persistência correta no banco de dados

Exemplo de código em JavaScript:

```javascript
const axios = require("axios");
const assert = require("assert");
const BASE_URL = "http://api.example.com/api/products";
let authToken = "";
beforeAll(async () => {
  // Configurar ambiente de teste e autenticação
  const response = await axios.post("http://api.example.com/api/auth/login", {
    username: "testuser",
    password: "testpassword",
  });
  authToken = response.data.token;
});
describe("Product API Integration Tests", () => {
  let createdProductId = null;

  test("Create product with valid data", async () => {
    const payload = {
      name: "Produto Exemplo",
      description: "Descrição do produto exemplo",
      price: 99.99,
      status: "active",
    };
    const response = await axios.post(BASE_URL, payload, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.data.name, payload.name);
    createdProductId = response.data.id;
  });

  test("Create product with invalid data (negative price)", async () => {
    const payload = {
      name: "Produto Inválido",
      description: "Descrição do produto inválido",
      price: -10.0,
      status: "active",
    };
    try {
      await axios.post(BASE_URL, payload, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    } catch (error) {
      assert.strictEqual(error.response.status, 400);
      assert.strictEqual(
        error.response.data.error,
        "Invalid price value. Price must be a positive number.",
      );
    }
  });

  test("Edit existing product", async () => {
    const payload = {
      name: "Produto Exemplo Editado",
      description: "Descrição atualizada do produto exemplo",
      price: 89.99,
      status: "inactive",
    };
    const response = await axios.put(
      `${BASE_URL}/${createdProductId}`,
      payload,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    );
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data.name, payload.name);
  });

  test("Edit non-existing product", async () => {
    const payload = {
      name: "Produto Inexistente",
      description: "Descrição do produto inexistente",
      price: 50.0,
      status: "active",
    };
    try {
      await axios.put(`${BASE_URL}/nonexistent-id`, payload, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    } catch (error) {
      assert.strictEqual(error.response.status, 404);
    }
  });

  test("Get product by ID", async () => {
    const response = await axios.get(`${BASE_URL}/${createdProductId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data.id, createdProductId);
  });
});
```

## 4 - Automação de testes frontend

- Setup:
  - Configurar ambiente de teste
  - Criar massa de dados
  - Iniciar aplicação frontend

Validaria os seguintes pontos:

- Validação de formulários (campos obrigatórios, formatos, etc.)
- Mensagens de erro exibidas corretamente
- Fluxo de criação e edição de produtos
- Interação com a API backend
- Atualização da interface após operações (criação, edição)

pseudo-código exemplo usando Cypress:

```javascript
test("Deve criar um produto ativo com sucesso", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);

  await loginPage.acessar();
  await loginPage.realizarLogin(user.email, user.senha);

  await productPage.accessProductRegistration();

  await productPage.fillProduct({
    name: product.name,
    price: product.price,
    description: product.description,
    status: "ativo",
  });

  await productPage.save();

  await productPage.validateSuccess();

  expect(await productPage.getSelectedStatus()).toBe("ativo");
});

test("Deve criar um produto inativo com sucesso", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);

  await loginPage.acessar();
  await loginPage.realizarLogin(user.email, user.senha);

  await productPage.accessProductRegistration();

  await productPage.fillProduct({
    name: product.name,
    price: product.price,
    description: product.description,
    status: "inativo",
  });

  await productPage.save();

  await productPage.validateSuccess();

  expect(await productPage.getSelectedStatus()).toBe("inativo");
});
```

## 5 - Análise de código

Trecho de código analisado:

```php
public function store(Request $request)
{
 $product = Product::create($request->all());
 return response()->json($product);
}
```

Análise:

- O código é responsável por criar um novo produto utilizando os dados recebidos na requisição.
- O método `create` do modelo `Product` é utilizado para criar o produto com os dados fornecidos.
- O resultado é retornado como uma resposta JSON.

Problemas identificados:

- Falta de validação dos dados recebidos: o codigo não verifica se os dados fornecidos são válidos antes de tentar criar o produto, o que pode levar a erros ou dados inconsistentes no banco de dados.
- Uso inseguro de Mass Assignment: o método `create` pode ser vulnerável a ataques de mass assignment se os campos do modelo não estiverem protegidos adequadamente com a propriedade `$fillable` ou `$guarded`, sem essa proteção, um usuário poderia facilmente enviar dados maliciosos para campos que não deveriam ser preenchidos, como 'id', 'price', etc.
- Falta de tratamento de erros: o código não possui nenhum mecanismo para lidar com possíveis erros que possam ocorrer durante a criação do produto, como falhas de conexão com o banco de dados ou dados inválidos, o que pode resultar em respostas de erro genéricas ou falhas silenciosas. Ou seja não possui um bloco try-catch para capturar exceções e retornar mensagens de erro apropriadas.

Quais os riscos esse código pode trazer para a aplicação?

- Risco de dados inválidos ou inconsistentes sendo inseridos no banco de dados devido à falta de validação.
- Risco de ataques de mass assignment, onde um usuário malicioso pode enviar dados para campos que não deveriam ser preenchidos, potencialmente comprometendo a segurança da aplicação. Como exemplo, um usuário poderia enviar um campo 'is_admin' para tentar obter privilégios administrativos.
- Quebra da integridade dos dados e falhas na aplicação devido à falta de tratamento de erros, o que pode resultar em uma má experiência do usuário e dificuldades para depurar problemas.
- Impossível garantir comportamentos consistentes e seguros na aplicação, o que pode levar a vulnerabilidades de segurança e problemas de manutenção a longo prazo.

Melhorias sugeridas:

- Implementar validação dos dados recebidos utilizando as regras de validação do Laravel para garantir que apenas dados válidos sejam processados. Adicionando um bloco de validação antes de criar o produto, como por exemplo:

```php
public function store(Request $request)
{
  $validatedData = $request->validate([
    'name' => 'required|string|max:255',
    'price' => 'required|numeric|min:0',
    'description' => 'nullable|string',
    'status' => 'required|in:active,inactive',
  ]);

  try {
    $product = Product::create($validatedData);
    return response()->json($product, 201);
  } catch (\Exception $e) {
    return response()->json(['error' => 'Failed to create product', 'message' => $e->getMessage()], 500);
  }
}
```

- Evitar o uso de Mass Assignment inseguro, garantindo que o modelo `Product` tenha a propriedade `$fillable` configurada corretamente para permitir apenas os campos que devem ser preenchidos. Por exemplo:

```php
class Product extends Model
{
  protected $fillable = ['name', 'price', 'description', 'status'];
}
```

- Implementaria tratamento de exceções para capturar erros que possam ocorrer durante a criação do produto e retornar mensagens de erro apropriadas, como mostrado no exemplo acima, onde um bloco try-catch é utilizado para lidar com possíveis falhas e retornar uma resposta JSON com detalhes do erro.

```php
{
  try {
    $product = Product::create($validatedData);
    return response()->json($product, 201);
} catch (\Exception $e) {
    return response()->json([
        'error' => 'Failed to create product'
    ], 500);
}
}
```

- Padronização dos retornos da API, garantindo que as respostas sejam consistentes e informativas, como retornar o código de status HTTP correto (201 para criação bem-sucedida) e incluir mensagens de erro claras em caso de falhas.

- Inserção de logs para monitorar falhas e erros, o que pode ajudar na depuração e manutenção da aplicação a longo prazo.

## 6 - Análise de código

Trecho de código analisado:

```php
public function index()
{
 $orders = Order::all();
 $result = [];
 foreach ($orders as $order) {
 $result[] = [
 'order_id' => $order->id,
 'customer_name' => $order->customer->name,
 'total' => $order->total,
 'items' => $order->items->map(function ($item) {
 return [
 'product_name' => $item->product->name,
 'quantity' => $item->quantity,
 'price' => $item->price,
 ];
 }),
 ];
 }
}
```

Questão 1: Que problema de qualidade e performance esse código pode gerar?

- O código pode gerar um problema de performance conhecido como "N+1 Query Problem". Isso ocorre porque para cada pedido (order) recuperado, o código faz consultas adicionais para obter o nome do cliente e os itens do pedido, resultando em um número de consultas que cresce linearmente com o número de pedidos. Se houver muitos pedidos, isso pode levar a um grande número de consultas ao banco de dados, causando lentidão na aplicação.

  Questão 2: Em que cenário esse problema se torna mais crítico?

- Esse problema se torna mais crítico em cenários onde há um grande número de pedidos. Por exemplo, se a tabela de pedidos contiver centenas ou milhares de registros, o número de consultas ao banco de dados pode se tornar extremamente alto, resultando em tempos de resposta muito lentos e uma má experiência para o usuário.

  Questão 3: Como você identificaria esse problema em um ambiente real?

- Para identificar esse problema em um ambiente real, eu utilizaria ferramentas de monitoramento de performance e análise de consultas ao banco de dados, como o Laravel Debugbar, varia o uso de testes de performance medindo o tempo de resposta da api com diferentes volumes de dados e utilizaria ferramentas para testes de carga como o JMeter ou K6 para simular um grande número de pedidos e observar o impacto na performance da aplicação.

  Questão 4: Que ajustes técnicos você sugeriria para evitar esse problema?

- Para evitar o problema de N+1 Query, eu sugeriria utilizar o recurso de eager loading do Laravel para carregar as relações necessárias em uma única consulta. Isso pode ser feito utilizando o método `with` para carregar as relações de cliente e itens junto com os pedidos. Por exemplo:

```php
public function index()
{
  $orders = Order::with(['customer', 'items.product'])->get();
  $result = [];
  foreach ($orders as $order) {
    $result[] = [
      'order_id' => $order->id,
      'customer_name' => $order->customer->name,
      'total' => $order->total,
      'items' => $order->items->map(function ($item) {
        return [
          'product_name' => $item->product->name,
          'quantity' => $item->quantity,
          'price' => $item->price,
        ];
      }),
    ];
  }
  return response()->json($result);
}
```

- Com essa abordagem, o Laravel irá realizar apenas três consultas ao banco de dados: uma para os pedidos, uma para os clientes relacionados e uma para os produtos relacionados aos itens, melhorando significativamente a performance da aplicação.

  Questão 5: Que tipo de teste automatizado ou validação você criaria para evitar que esse tipo de
  problema volte a acontecer?

- Para evitar que esse tipo de problema volte a acontecer, eu criaria testes de integração que verificassem o número de consultas ao banco de dados realizadas durante a execução do endpoint. Utilizando ferramentas como o Laravel Debugbar ou o Laravel Telescope, eu poderia monitorar as consultas e garantir que o número de consultas seja constante, independentemente do número de pedidos. Além disso, eu implementaria testes de performance para medir o tempo de resposta do endpoint com diferentes volumes de dados, garantindo que a performance permaneça aceitável mesmo com um grande número de pedidos.

## 7 - Processo e cultura

1. Como o QA pode ajudar a criar uma cultura de testes unitários em um time de
   desenvolvimento?

- O QA pode ajudar a criar uma cultura de testes unitários em um time de desenvolvimento promovendo a importância dos testes desde o início do projeto, colaborando com os desenvolvedores para escrever testes unitários eficazes, fornecendo feedback sobre a cobertura de testes e incentivando a prática de TDD (Test-Driven Development). O QA também pode ajudar a responder perguntas sobres quais os cenários mais críticos que exigem uma cobertura maior, ajudando a identificar as regras de negócio que precisam estar cobertas, fluxos com maior risco e sempre sugerir melhorias nas PRs para garantir que os testes sejam escritos e mantidos adequadamente. O QA não poderia obrigar os desenvolvedores a escreverem os testes mas pode criar um ambiente de colaboração e suporte para incentivar a prática, mostrando os benefícios dos testes unitários para a qualidade do código e a manutenção a longo prazo da aplicação.

2. Em que momentos do processo você acredita que o QA deve atuar?

- O QA deve atuar em várias etapas do processo de desenvolvimento, incluindo:
  - Refinamento e planejamento: Participar das reuniões de planejamento para entender os requisitos e ajudar a definir critérios de aceitação e casos de teste. Com isso o QA já previne possíveis falhas e garante que os requisitos sejam claros e testáveis antes mesmo do codigo ser escrito.
  - Desenvolvimento: Colaborar com os desenvolvedores durante a escrita do código, revisando as PRs para garantir que os testes sejam escritos e que as regras de negócio estejam sendo seguidas e definição de testes automatizados para garantir a qualidade do código trabalhando novamente na prevenção de falhas.
  - Testes: Realizar testes manuais e automatizados para validar as funcionalidades implementadas, garantindo que os critérios de aceitação sejam atendidos e que a aplicação esteja funcionando conforme o esperado. Aplicando as estrategias de teste adequadas para cada cenário, como testes de integração, testes de regressão, funcionais, segurança, etc.
  - Deploy e monitoramento: Ajudar a monitorar a aplicação em produção, identificando e reportando quaisquer problemas que possam surgir, além de colaborar na análise de falhas e na implementação de correções.
- O QA deve estar envolvido em todo o ciclo de vida do desenvolvimento, desde a concepção até a manutenção, para garantir que a qualidade seja uma prioridade em todas as etapas do processo.

3. Como você lida com pressão para liberar algo sem testes adequados?

- Diante de pressão para liberar algo sem testes adequados, eu procuraria comunicar claramente os riscos envolvidos em liberar código sem testes, como a possibilidade de introduzir bugs, falhas de segurança e problemas de manutenção a longo prazo. Eu tentaria negociar um compromisso, sugerindo a implementação de testes mínimos ou focando nos cenários mais críticos para garantir que pelo menos as funcionalidades essenciais estejam cobertas. Se a pressão persistir, eu documentaria as decisões tomadas e os riscos associados, garantindo que haja um registro claro do que foi acordado e das possíveis consequências. Além disso, eu continuaria defendendo a importância dos testes e buscando oportunidades para melhorar a cultura de qualidade no time, mesmo diante de desafios.

## 8 - Diferenciais

1. Descrever como integraria testes automatizados a um pipeline de CI/CD

- Para integrar testes automatizados a um pipeline de CI/CD, eu seguiria os seguintes passos:
  - Configuração do ambiente de CI/CD: Escolheria uma ferramenta de CI/CD como Jenkins, GitHub Actions, GitLab CI, CircleCI, etc., e configuraria o ambiente para executar os testes automatizados.
  - Definição dos testes a serem executados: Identificaria quais testes automatizados devem ser executados em cada etapa do pipeline, como testes unitários, testes de integração, testes de regressão, etc.
  - Configuração do pipeline: Criaria um pipeline que inclua etapas para instalar dependências, configurar o ambiente de teste e executar os testes automatizados. Por exemplo, em um pipeline típico, eu poderia ter etapas como "Install Dependencies", "Run Unit Tests", "Run Integration Tests", "Deploy to Staging", etc.
  - Monitoramento e feedback: Configuraria notificações para alertar a equipe sobre o status dos testes, como falhas ou sucessos, para garantir que os problemas sejam identificados e corrigidos rapidamente.
  - Melhoria contínua: Analisaria os resultados dos testes e ajustaria o pipeline conforme necessário para otimizar a execução dos testes e garantir que eles sejam eficazes na detecção de problemas.

2. Explicar como priorizaria testes em um sistema grande com pouco tempo.

- Em um sistema grande com pouco tempo, eu priorizaria os testes com base em critérios como:
  - Risco: Focaria nos testes que cobrem as funcionalidades mais críticas e que têm maior impacto no negócio, como processos de pagamento, autenticação, etc.
  - Frequência de uso: Prioritaria os testes para as funcionalidades que são mais utilizadas pelos usuários, garantindo que as partes mais acessadas do sistema estejam bem testadas.
  - Histórico de falhas: Analisaria o histórico de falhas e bugs para identificar áreas do sistema que são mais propensas a problemas e priorizaria os testes nessas áreas.
  - Complexidade: Daria prioridade aos testes para as partes do código que são mais complexas e difíceis de entender, pois essas áreas tendem a ser mais propensas a erros.

3. Exemplificar um bug crítico que você ajudou a evitar antes de ir para produção.

- Em um projeto anterior, durante a fase de testes, em uma sprint de alto impacto, identifiquei um bug em como as casas decimais estavam sendo tratadas na nota geral de nossos anunciantes, o que poderia levar a cálculos incorretos e exibição de valores errados com muitas casas decimais, o que poderia causar confusão para os usuários e impactar negativamente a experiência do cliente. Ao identificar esse problema durante os testes, consegui trabalhar com a equipe de desenvolvimento para corrigir o bug antes que ele fosse para produção, garantindo que os cálculos fossem precisos e a exibição dos valores fosse adequada, evitando assim um impacto negativo na experiência do usuário e possíveis reclamações.

## 8 - O que você entende do log ?

```
[2018-05-16 01:07:31] production.ERROR: Call to a member function getImage() on null {"exception":"[object]
(Symfony\\Component\\Debug\\Exception\\FatalThrowableError(code: 0): Call to a member function getImage() on null at
/admin/app/Models/Imagem.php:147)
[stacktrace]

......
```

- O log indica que ocorreu um erro fatal no ambiente de produção em 16 de maio de 2018 às 01:07:31. O erro é do tipo "Call to a member function getImage() on null", o que significa que o código tentou chamar o método `getImage()` em uma variável que é nula. O erro ocorreu no arquivo `Imagem.php` na linha 147. O log também inclui uma pilha de chamadas (stacktrace) que pode ser usada para rastrear a origem do erro e entender como ele ocorreu. Esse tipo de erro geralmente indica que há um problema com a lógica do código, onde uma variável não foi inicializada corretamente ou um objeto esperado não foi criado antes de tentar acessar seus métodos.
