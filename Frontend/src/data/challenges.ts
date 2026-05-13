export interface ChallengeData {
  id: number;
  moduleId: number;
  title: string;
  xpReward: number;
  storyParagraphs: string[];
  hint: string;
  initialCode: string;
  validationKeywords: string[];
  expectedOutput: string;
  successMessage: string;
  errorHint: string;
}

export interface ModuleData {
  id: number;
  name: string;
  icon: string;
  challenges: number[];
}

export const modules: ModuleData[] = [
  { id: 1, name: "Condicionais", icon: "GitBranch", challenges: [1, 2, 3, 4, 5] },
  { id: 2, name: "Laços de Repetição", icon: "Repeat", challenges: [6, 7, 8, 9] },
  { id: 3, name: "Funções", icon: "Code2", challenges: [10, 11, 12] },
];

export const challenges: ChallengeData[] = [
  // === MODULE 1: CONDICIONAIS ===
  {
    id: 1,
    moduleId: 1,
    title: "O Primeiro Sinal",
    xpReward: 100,
    storyParagraphs: [
      "Explorador, acabamos de captar um sinal vindo de um planeta desconhecido. Nossos sensores indicam que ele pode ser amigável ou hostil.",
      "Seu primeiro comando é simples: verifique se o sinal é 'amigável'. Se for, envie uma saudação usando print().",
      "Use o terminal abaixo e escreva a condição correta dentro do bloco if.",
    ],
    hint: "Em Python, usamos if condição: para tomar decisões. Tente: print(\"amigável\")",
    initialCode: `# Verifique se o sinal é amigável
# e envie uma saudação

sinal = "amigável"

if sinal == "amigável":
    # Escreva o comando print aqui
    `,
    validationKeywords: ["print"],
    expectedOutput: "amigável",
    successMessage: "Sinal recebido! A civilização respondeu com uma saudação!",
    errorHint: "saída incorreta, tente a mensagem (amigável) ",
  },
  {
    id: 2,
    moduleId: 1,
    title: "Decisões na Nebulosa",
    xpReward: 120,
    storyParagraphs: [
      "A nave se aproxima de uma nebulosa densa. Os sensores detectam duas rotas possíveis: uma segura e outra perigosa.",
      "Você precisa programar o sistema de navegação para escolher a rota correta. Se a rota for 'segura', 'avance'. Caso contrário, recue.",
      "Use if e else para criar a lógica de decisão!",
    ],
    hint: "Em Python, if/else permite escolher entre dois caminhos: if condição: ... else: ...",
    initialCode: `# Programe o sistema de navegação
# Use if/else para decidir a rota

rota = [insira rota apropriada]

if rota == "segura":
    # O que fazer se for segura?
    
[insira else aqui, não se esqueça dos dois pontos!]
    print("rota perigosa, recuando!")
    `,
    validationKeywords: ["print", "else"],
    expectedOutput: "rota segura, avançar",
    successMessage: "Navegação configurada! A nave segue pela rota segura!",
    errorHint: "saída incorreta, tente a mensagem (rota segura, e ação a ser feita) no bloco if.",
  },
  {
    id: 3,
    moduleId: 1,
    title: "Caminhos Estelares",
    xpReward: 140,
    storyParagraphs: [
      "Três portais apareceram diante da nave: o 'Portal Azul' leva a uma estação de combustível, o 'Portal Vermelho' a um campo de asteroides, e o 'Portal Verde' a um planeta habitável.",
      "Você deve programar o computador de bordo para escolher o portal correto baseado na cor detectada.",
      "Use if, elif e else para cobrir todas as possibilidades!",
    ],
    hint: "Use elif para verificar condições adicionais: if cor == 'azul': ... elif cor == 'verde': ... else: ...",
    initialCode: `# Escolha o portal correto
# Use if, elif e else

cor_portal = "verde"

if cor_portal == [insira cor apropriada]:
    print("Rumo à estação de combustível!")
[insira elif e condição aqui!]
    # O que acontece no portal verde?

else:
    print("Rumo ao campo de asteroides, cuidado!")
    `,
    validationKeywords: ["elif", "print"],
    expectedOutput: "Rumo ao planeta habitável!",
    successMessage: "Portal selecionado! O planeta habitável nos espera!",
    errorHint: "saída incorreta, utilize as outras mensagens para escolher o portal correto",
  },
  {
    id: 4,
    moduleId: 1,
    title: "O Guardião da Porta",
    xpReward: 150,
    storyParagraphs: [
      "O Guardião da Porta Estelar de Arkonis exige duas verificações: o nível de energia deve ser 'maior que 50' E o código de acesso deve ser 'ARKONIS'.",
      "Apenas quando ambas as condições forem verdadeiras, a porta se abrirá.",
      "Use operadores lógicos para combinar as condições!",
    ],
    hint: "Em Python, use 'and' para combinar condições: if condição1 and condição2:",
    initialCode: `# Passe pela porta de Arkonis
# Ambas condições devem ser verdadeiras

energia = [insira valor de energia apropriado]
codigo = [insira código apropriado]

if energia > 50 [insira operador lógico] codigo == "ARKONIS":
    # O que acontece quando a porta abre?
    
else:
    print("Acesso negado!")`,
    validationKeywords: ["and", "print"],
    expectedOutput: "abrir portal para ARKONIS",
    successMessage: "A porta se abre! Bem-vindo a Arkonis, Explorador!",
    errorHint: "saída incorreta, verifique se ambas as condições estão corretas e use 'and' para combiná-las.",
  },
  {
    id: 5,
    moduleId: 1,
    title: "Labirinto Binário",
    xpReward: 180,
    storyParagraphs: [
      "Você entrou no Labirinto Binário, onde cada sala tem um número. Salas 'pares' são seguras, salas 'ímpares' são armadilhas.",
      "Além disso, se o número da sala for maior que 100, há um tesouro escondido!",
      "Crie uma lógica com condições aninhadas para verificar se a sala é par E se contém um tesouro.",
    ],
    hint: "Use o operador % (módulo) para verificar se é par: numero % 2 == 0. Aninhe ifs para o tesouro!",
    initialCode: `# Navegue pelo Labirinto Binário
# Verifique se a sala é par e se tem tesouro

sala = 102

if [insiração vericação para sala par]
    print("Sala segura!")
    if sala > [insira numero da sala do tesouro]:
        # O que foi encontrado na sala?
        
else:
    # O que acontece em salas ímpares?
    `,
    validationKeywords: ["print", "% 2"],
    expectedOutput: "Sala segura!\nTesouro encontrado",
    successMessage: "Labirinto conquistado! Tesouro coletado na sala 102!",
    errorHint: "saída incorreta, verifique se a sala é par usando % 2 e se o número é maior que 100 para encontrar o tesouro.",
  },

  // === MODULE 2: LAÇOS DE REPETIÇÃO ===
  {
    id: 6,
    moduleId: 2,
    title: "Órbita Infinita",
    xpReward: 150,
    storyParagraphs: [
      "A nave entrou em órbita ao redor de um planeta misterioso. Para estabilizar, os propulsores devem disparar 5 vezes.",
      "Use um laço while para disparar os propulsores até atingir o número correto de disparos.",
      "Cuidado: não esqueça de incrementar o contador ou ficará preso em uma órbita infinita!",
    ],
    hint: "Use while com um contador: while disparos < 5: print(...) e disparos += 1",
    initialCode: `# Estabilize a órbita!
# Dispare os propulsores 5 vezes

disparos = 0

while disparos < [insira número de disparos]:
    # Dispare o propulsor e atualize o contador
    #atualzie o numero de disparos aqui
    `,
    validationKeywords: ["print", "+="],
    expectedOutput: "Disparo 1\nDisparo 2\nDisparo 3\nDisparo 4\nDisparo 5",
    successMessage: "Órbita estabilizada! 5 disparos executados com precisão!",
    errorHint: "saída incorreta, lembre-se de incrementar o contador de disparos dentro do loop para evitar um loop infinito.",
  },
  {
    id: 7,
    moduleId: 2,
    title: "Ciclo das Estrelas",
    xpReward: 160,
    storyParagraphs: [
      "O telescópio de bordo detectou uma sequência de '7 estrelas'. Você precisa catalogar cada uma delas.",
      "Use um laço for com range() para percorrer todas as estrelas e registrar suas posições.",
      "O catálogo estelar da nave será atualizado automaticamente!",
    ],
    hint: "Use for com range: for i in range(): print(f\"Estrela {i + 1}\")",
    initialCode: `# Catalogue as 7 estrelas detectadas
# Use um laço for com range()

for i in range([insira número de estrelas]):
    # Registre cada estrela
    `,
    validationKeywords: ["print", "range"],
    expectedOutput: "Estrela 1\nEstrela 2\nEstrela 3\nEstrela 4\nEstrela 5\nEstrela 6\nEstrela 7",
    successMessage: "Catálogo estelar atualizado! 7 estrelas registradas!",
    errorHint: "saída incorreta, lembre-se de usar range(7) para percorrer as 7 estrelas e imprimir suas posições corretamente.",
  },
  {
    id: 8,
    moduleId: 2,
    title: "Padrão Galáctico",
    xpReward: 180,
    storyParagraphs: [
      "Os cientistas da nave descobriram um padrão em uma 'grade 3x3' de sinais cósmicos. Cada célula emite um pulso.",
      "Você precisa usar laços aninhados para varrer toda a grade e ler cada sinal.",
      "Um laço para as linhas e outro para as colunas — é a forma de mapear o padrão completo!",
    ],
    hint: "Laços aninhados: for linha in range(): for coluna in range(): print(f\"Sinal [{linha}][{coluna}]\")",
    initialCode: `# Varra a grade 3x3 de sinais
# Use laços aninhados (for dentro de for)

for linha in range([insira número de linhas]):
    [insira laço para colunas aqui]:
        # Leia o sinal em cada posição
        `,
    validationKeywords: ["print", "for", "range"],
    expectedOutput: "Sinal [0][0]\nSinal [0][1]\nSinal [0][2]\nSinal [1][0]\nSinal [1][1]\nSinal [1][2]\nSinal [2][0]\nSinal [2][1]\nSinal [2][2]",
    successMessage: "Padrão decodificado! Todos os 9 sinais foram mapeados!",
    errorHint: "saída incorreta, lembre-se de usar dois laços for para percorrer as linhas e colunas da grade 3x3 e imprimir cada sinal corretamente.",
  },
  {
    id: 9,
    moduleId: 2,
    title: "Motor de Dobra",
    xpReward: 200,
    storyParagraphs: [
      "O motor de dobra precisa carregar energia. A cada ciclo, a energia aumenta em 15 unidades.",
      "Quando a energia atingir 100 ou mais, o motor está pronto e você deve parar o carregamento com break.",
      "Sem o 'break', o motor pode sobrecarregar e explodir!",
    ],
    hint: "Use while True: com uma condição if para dar break quando energia >= 100.",
    initialCode: `# Carregue o motor de dobra
# Pare com break ao atingir 100 de energia

energia = 0

while True:
    energia += 15
    print(f"Energia: {energia}")
    if [insira condição de parada aqui]:
        # Pare o carregamento!
        `,
    validationKeywords: ["break", "print"],
    expectedOutput: "Energia: 15\nEnergia: 30\nEnergia: 45\nEnergia: 60\nEnergia: 75\nEnergia: 90\nEnergia: 105",
    successMessage: "Motor de dobra carregado! Pronto para o salto hiperespacial!",
    errorHint: "saída incorreta, lembre-se de usar break para parar o loop quando a energia atingir 100 ou mais, evitando um loop infinito.",
  },

  // === MODULE 3: FUNÇÕES ===
  {
    id: 10,
    moduleId: 3,
    title: "Módulo de Comando",
    xpReward: 180,
    storyParagraphs: [
      "A nave precisa de um módulo de comando reutilizável. Em vez de repetir código, crie uma função que pode ser chamada sempre que necessário.",
      "Defina uma função chamada saudacao() que imprime uma mensagem de 'boas-vindas ao tripulante'.",
      "Depois de definir, chame a função para testá-la!",
    ],
    hint: "Defina com def saudacao(): e dentro use print(\"boas-vindas ao tripulante\"). Depois chame: saudacao()",
    initialCode: `# Crie o módulo de comando
# Defina e chame uma função

def saudacao():
    # O que a função deve fazer?
    

# Chame a função aqui
`,
    validationKeywords: ["def", "print", "saudacao()"],
    expectedOutput: "boas-vindas ao tripulante",
    successMessage: "Módulo de comando instalado! Função operacional!",
    errorHint: "saída incorreta, lembre-se de definir a função saudacao() com a mensagem correta e chamá-la para ver a mensagem.",
  },
  {
    id: 11,
    moduleId: 3,
    title: "Protocolo Estelar",
    xpReward: 200,
    storyParagraphs: [
      "Cada planeta requer um protocolo de comunicação personalizado. Crie uma função que receba o nome do planeta como parâmetro.",
      "A função deve imprimir uma mensagem de saudação específica para aquele planeta.",
      "Teste chamando a função com diferentes nomes de planetas!",
    ],
    hint: "Use parâmetros: def protocolo(planeta): print(f\"Saudações ao planeta {planeta}!\") e chame: protocolo('Marte')",
    initialCode: `# Crie o protocolo de comunicação
# A função deve receber o nome do planeta

def protocolo(planeta):
    # Envie uma saudação ao planeta
    

# Teste para o planeta Marte
`,
    validationKeywords: ["def", "print", "planeta"],
    expectedOutput: "Saudações ao planeta Marte!",
    successMessage: "Protocolo ativo! Comunicação estabelecida com sucesso!",
    errorHint: "saída incorreta, lembre-se de usar print(f\"Saudações ao planeta {planeta}!\") dentro da função.",
  },
  {
    id: 12,
    moduleId: 3,
    title: "O Grande Retorno",
    xpReward: 250,
    storyParagraphs: [
      "Para a viagem de volta, o computador precisa calcular o combustível necessário. Crie uma função que receba a distância e retorne a quantidade de combustível.",
      "A fórmula é simples: 'combustível = distância * 0.5'. Use return para devolver o resultado.",
      "Este é o desafio final da sua odisseia. Mostre que você domina funções com retorno!",
    ],
    hint: "Use return para devolver valores: def calcular_combustivel(distancia): return distancia * 0.5",
    initialCode: `# Calcule o combustível para a viagem de volta
# Use return para retornar o resultado

def calcular_combustivel(distancia):
    # insira fórmula de retorno aqui
    

# Teste a função
resultado = calcular_combustivel(200)
print(f"Combustível necessário: {resultado}")
`,
    validationKeywords: ["def", "return", "distancia"],
    expectedOutput: "Combustível necessário: 100.0",
    successMessage: "Cálculo perfeito! A nave tem combustível para voltar! Parabéns, Explorador, sua odisseia está completa!",
    errorHint: "saída incorreta, retorne a formula correta dentro da função e teste com a distância fornecida.",
  },
];

export const getChallengeById = (id: number): ChallengeData | undefined =>
  challenges.find((c) => c.id === id);

export const getModuleForChallenge = (challengeId: number): ModuleData | undefined => {
  const challenge = getChallengeById(challengeId);
  if (!challenge) return undefined;
  return modules.find((m) => m.id === challenge.moduleId);
};

export const getChallengeIndex = (challengeId: number): { moduleIndex: number; challengeIndex: number } | undefined => {
  for (const mod of modules) {
    const idx = mod.challenges.indexOf(challengeId);
    if (idx !== -1) return { moduleIndex: mod.id - 1, challengeIndex: idx };
  }
  return undefined;
};