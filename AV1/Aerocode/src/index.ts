// Importa bibliotecas externas e módulos locais para a aplicação.
// O 'readline' é usado para interagir com o usuário na linha de comando.
// O 'fs/promises' e 'path' são usados para manipulação de arquivos e caminhos.
import * as readline from "readline";
import { promises as fs } from "fs";
import * as path from "path";

// Importa as classes de modelo que representam as entidades do sistema.
// Isso promove a modularidade e a organização do código.
import { Aeronave } from "./models/Aeronave.js";
import { Peca } from "./models/Peca.js";
import { Etapa } from "./models/Etapa.js";
import { Funcionario } from "./models/Funcionario.js";
import { Teste } from "./models/Teste.js";
import { Relatorio } from "./models/Relatorio.js";

// Importa os enums (listas de constantes) para garantir a consistência dos dados.
// Eles definem os possíveis valores para tipos, status e permissões.
import { TipoTeste } from "./enums/TipoTeste.js";
import { ResultadoTeste } from "./enums/ResultadoTeste.js";
import { TipoAeronave } from "./enums/TipoAeronave.js";
import { TipoPeca } from "./enums/TipoPeca.js";
import { StatusPeca } from "./enums/StatusPeca.js";
import { StatusEtapa } from "./enums/StatusEtapa.js";
import { NivelPermissao } from "./enums/NivelPermissao.js";

// --- Readline e função perguntar ---

// Cria uma interface de leitura para receber entrada do teclado (process.stdin).
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Envolve a função de pergunta do readline em uma Promise,
// permitindo que ela seja usada com async/await, o que deixa o código mais limpo.
function perguntar(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

// --- Dados em memória (simulam BD) ---

// Define os caminhos para os arquivos de dados, centralizando a configuração.
const DATA_DIR = path.resolve(process.cwd(), "data");
const AERONAVES_FILE = path.join(DATA_DIR, "aeronaves.json");
const PECAS_FILE = path.join(DATA_DIR, "pecas.json");
const ETAPAS_FILE = path.join(DATA_DIR, "etapas.json");
const FUNCIONARIOS_FILE = path.join(DATA_DIR, "funcionarios.json");
const TESTES_FILE = path.join(DATA_DIR, "testes.json");

// Arrays em memória para armazenar os dados do sistema.
// Eles agem como um banco de dados temporário.
let aeronaves: any[] = [];
let pecas: any[] = [];
let etapas: any[] = [];
let funcionarios: any[] = [];
let testes: any[] = [];

// Variável para armazenar o funcionário atualmente autenticado.
let currentUser: any = null;

// --- Utilitários de persistência ---

// Garante que o diretório 'data' exista para salvar os arquivos.
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Ignora o erro se o diretório já existir.
  }
}

// Salva os dados em um arquivo JSON.
// O 'JSON.stringify(data, null, 2)' formata o JSON com indentação para facilitar a leitura.
async function salvarArquivo(file: string, data: any) {
  await ensureDataDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

// Carrega os dados de um arquivo JSON.
// O bloco try/catch lida com o caso em que o arquivo não existe, retornando um array vazio.
async function carregarArquivo(file: string): Promise<any[]> {
  try {
    const txt = await fs.readFile(file, "utf-8");
    return JSON.parse(txt);
  } catch (err) {
    return [];
  }
}

// Salva todos os arrays de dados em seus respectivos arquivos.
// O 'Promise.all' executa as operações de escrita em paralelo para maior eficiência.
async function salvarTodos() {
  await Promise.all([
    salvarArquivo(AERONAVES_FILE, aeronaves),
    salvarArquivo(PECAS_FILE, pecas),
    salvarArquivo(ETAPAS_FILE, etapas),
    salvarArquivo(FUNCIONARIOS_FILE, funcionarios),
    salvarArquivo(TESTES_FILE, testes),
  ]);
}

// Carrega os dados de todos os arquivos JSON para os arrays em memória.
async function carregarTodos() {
  aeronaves = await carregarArquivo(AERONAVES_FILE);
  pecas = await carregarArquivo(PECAS_FILE);
  etapas = await carregarArquivo(ETAPAS_FILE);
  funcionarios = await carregarArquivo(FUNCIONARIOS_FILE);
  testes = await carregarArquivo(TESTES_FILE);
}

// --- Autenticação ---

// Lógica para cadastrar um novo funcionário.
async function cadastrarFuncionarioCLI() {
  console.log("\n____________________________________");
  console.log("\n____ Cadastro de Funcionário _____");
  const id = await perguntar("ID único: ");
  // Valida se o ID já existe.
  if (funcionarios.find((f) => f.id === id)) {
    console.log("❌ Já existe funcionário com esse ID!");
    return;
  }
  const nome = await perguntar("Nome: ");
  const telefone = await perguntar("Telefone: ");
  const endereco = await perguntar("Endereço: ");
  const usuario = await perguntar("Usuário (login): ");
  // Valida se o usuário já existe.
  if (funcionarios.find((f) => f.usuario === usuario)) {
    console.log("❌ Usuário já existe!");
    return;
  }
  const senha = await perguntar("Senha: ");
  console.log("Nível: 1) ADMINISTRADOR  2) ENGENHEIRO  3) OPERADOR");
  const nivelStr = await perguntar("Escolha nível: ");
  let nivel: NivelPermissao;
  if (nivelStr === "1") nivel = NivelPermissao.ADMINISTRADOR;
  else if (nivelStr === "2") nivel = NivelPermissao.ENGENHEIRO;
  else nivel = NivelPermissao.OPERADOR;

  let f: any;
  try {
    // Tenta criar uma instância da classe Funcionario.
    f = new Funcionario(id, nome, telefone, endereco, usuario, senha, nivel);
  } catch (err) {
    // Se a classe não for funcional, cria um objeto simples.
    f = { id, nome, telefone, endereco, usuario, senha, nivelPermissao: nivel };
  }
  funcionarios.push(f);
  await salvarTodos();
  console.log("✅ Funcionário cadastrado.");
}

// Lógica para autenticar um funcionário.
async function autenticarCLI() {
  console.log("\n____________________________");
  console.log("\n___ Autenticação ___");
  console.log("Digite seu usuário e senha para fazer login.");
  console.log("______________________________");
  const usuario = await perguntar("Usuário: ");
  const senha = await perguntar("Senha: ");

  // Procura o funcionário com base no usuário e senha.
  const f = funcionarios.find((x) => x.usuario === usuario && x.senha === senha);
  if (!f) {
    console.log("❌ Usuário/Senha inválidos.");
    return;
  }
  currentUser = f;
  console.log(`✅ Autenticado como ${f.nome} (${NivelPermissao[f.nivelPermissao] || f.nivelPermissao}).`);
}

// Função de utilidade para checar se o usuário está logado.
function exigirAutenticacao() {
  if (!currentUser) {
    console.log("❌ Ação restrita: faça login primeiro.");
    return false;
  }
  return true;
}

// Função de utilidade para checar o nível de permissão do usuário logado.
// Permite verificar um único nível ou um array de níveis.
function exigirNivel(minNivel: NivelPermissao | NivelPermissao[]) {
  return (): boolean => {
    if (!exigirAutenticacao()) return false;
    const allowed = Array.isArray(minNivel) ? minNivel : [minNivel];
    if (!allowed.includes(currentUser.nivelPermissao)) {
      console.log("❌ Permissão insuficiente para executar essa ação.");
      return false;
    }
    return true;
  };
}

// --- Aeronaves ---

// Lógica para cadastrar uma nova aeronave.
async function cadastrarAeronave() {
  // Verifica se o usuário tem permissão para a ação.
  if (!exigirNivel([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO])()) return;
  console.log("\n____________________________");
  console.log("\n___ Cadastro de Aeronave ___");
  console.log("______________________________");
  const codigo = await perguntar("Código único: ");
  if (aeronaves.find((a) => a.codigo === codigo)) {
    console.log("❌ Já existe aeronave com esse código!");
    return;
  }
  const modelo = await perguntar("Modelo: ");
  console.log("Tipo: 1) COMERCIAL  2) MILITAR");
  const tipoStr = await perguntar("Escolha o tipo: ");
  let tipo: TipoAeronave;
  if (tipoStr === "1") tipo = TipoAeronave.COMERCIAL;
  else if (tipoStr === "2") tipo = TipoAeronave.MILITAR;
  else { console.log("❌ Tipo inválido"); return; }

  const capacidadeStr = await perguntar("Capacidade (número): ");
  const alcanceStr = await perguntar("Alcance (km): ");
  const capacidade = Number(capacidadeStr) || 0;
  const alcance = Number(alcanceStr) || 0;

  let a: any;
  try {
    a = new Aeronave(codigo, modelo, tipo, capacidade, alcance);
  } catch (err) {
    a = { codigo, modelo, tipo, capacidade, alcance, pecas: [], etapas: [], testes: [] };
  }

  aeronaves.push(a);
  await salvarTodos();
  console.log("✅ Aeronave cadastrada.");
}

// Exibe uma lista de todas as aeronaves cadastradas.
function listarAeronaves() {
  console.log("\n_____________________________");
  console.log("\n___ Listagem de Aeronaves ___");
  console.log("______________________________");
  if (aeronaves.length === 0) {
    console.log("Nenhuma aeronave cadastrada.");
    return;
  }
  for (const a of aeronaves) {
    console.log("____________________________");
    console.log(`Código: ${a.codigo}`);
    console.log(`Modelo: ${a.modelo}`);
    console.log(`Tipo: ${a.tipo}`);
    console.log(`Capacidade: ${a.capacidade}`);
    console.log(`Alcance: ${a.alcance}`);
    // Conta as peças e etapas associadas a cada aeronave para exibição.
    const pecasQtd = pecas.filter((p) => p.aeronaveCodigo === a.codigo).length;
    const etapasQtd = etapas.filter((e) => e.aeronaveCodigo === a.codigo).length;
    console.log(`Peças: ${pecasQtd}  Etapas: ${etapasQtd}`);
  }
}

// --- Peças ---

// Lógica para cadastrar uma nova peça.
async function cadastrarPeca() {
  if (!exigirNivel([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR])()) return;
  console.log("\n________________________");
  console.log("\n___ Cadastro de Peça ___");
  console.log("__________________________");
  const aeronaveCodigo = await perguntar("Código da aeronave que receberá a peça (ou ENTER para cadastrar sem vínculo): ");
  // Valida se a aeronave informada existe.
  if (aeronaveCodigo && !aeronaves.find((a) => a.codigo === aeronaveCodigo)) {
    console.log("❌ Aeronave não encontrada!");
    return;
  }
  const nome = await perguntar("Nome da peça: ");
  console.log("Tipo: 1) NACIONAL  2) IMPORTADA");
  const tipoStr = await perguntar("Escolha tipo: ");
  let tipo: TipoPeca;
  if (tipoStr === "1") tipo = TipoPeca.NACIONAL;
  else if (tipoStr === "2") tipo = TipoPeca.IMPORTADA;
  else { console.log("❌ Tipo inválido"); return; }

  const fornecedor = await perguntar("Fornecedor: ");
  console.log("Status: 1) PRODUCAO  2) TRANSPORTE  3) PRONTA");
  const statusStr = await perguntar("Escolha status: ");
  let status: StatusPeca;
  if (statusStr === "1") status = StatusPeca.PRODUCAO;
  else if (statusStr === "2") status = StatusPeca.TRANSPORTE;
  else status = StatusPeca.PRONTA;

  let p: any;
  try {
    p = new Peca(nome, tipo, fornecedor, status);
    p.aeronaveCodigo = aeronaveCodigo || null;
  } catch (err) {
    p = { nome, tipo, fornecedor, status, aeronaveCodigo: aeronaveCodigo || null };
  }

  pecas.push(p);
  await salvarTodos();
  console.log("✅ Peça cadastrada.");
}

// Lógica para atualizar o status de uma peça existente.
async function atualizarStatusPeca() {
  if (!exigirNivel([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR])()) return;
  console.log("\n________________________________");
  console.log("\n___ Atualizar Status da Peça ___");
  console.log("__________________________________");
  const nome = await perguntar("Nome da peça (exato): ");
  const p = pecas.find((x) => x.nome === nome);
  if (!p) {
    console.log("❌ Peça não encontrada.");
    return;
  }
  console.log("Novo status: 1) PRODUCAO  2) TRANSPORTE  3) PRONTA");
  const s = await perguntar("Escolha: ");
  if (s === "1") p.status = StatusPeca.PRODUCAO;
  else if (s === "2") p.status = StatusPeca.TRANSPORTE;
  else if (s === "3") p.status = StatusPeca.PRONTA;
  else { console.log("❌ Valor inválido"); return; }
  await salvarTodos();
  console.log("✅ Status atualizado.");
}

// --- Etapas ---

// Lógica para cadastrar uma nova etapa de produção.
async function cadastrarEtapa() {
  if (!exigirNivel([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO])()) return;
  console.log("\n_________________________");
  console.log("\n___ Cadastro de Etapa ___");
  console.log("__________________________");
  const aeronaveCodigo = await perguntar("Código da aeronave (vincular etapa): ");
  const aeronave = aeronaves.find((a) => a.codigo === aeronaveCodigo);
  if (!aeronave) {
    console.log("❌ Aeronave não encontrada!");
    return;
  }
  const nome = await perguntar("Nome da etapa: ");
  const prazoStr = await perguntar("Prazo (em dias): ");
  const prazo = Number(prazoStr) || 0;
  let e: any;
  try {
    e = new Etapa(aeronaveCodigo, nome, prazo);
    e.status = StatusEtapa.PENDENTE;
    e.funcionarios = [];
  } catch (err) {
    e = { aeronaveCodigo, nome, prazo, status: StatusEtapa.PENDENTE, funcionarios: [] };
  }
  etapas.push(e);
  await salvarTodos();
  console.log("✅ Etapa cadastrada.");
}

// Lógica para iniciar uma etapa, com uma regra de negócio importante.
async function iniciarEtapa() {
  if (!exigirNivel([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO])()) return;

  console.log("\n_________________________");
  console.log("\n___ Iniciar Etapa ___");
  console.log("__________________________");
  const nomeEtapa = await perguntar("Nome da etapa: ");
  const etapa = etapas.find((e) => e.nome === nomeEtapa);
  if (!etapa) {
    console.log("❌ Etapa não encontrada.");
    return;
  }
  const etapasDaAeronave = etapas.filter((e) => e.aeronaveCodigo === etapa.aeronaveCodigo);
  const idx = etapasDaAeronave.findIndex((x) => x.nome === etapa.nome);
  const anteriores = etapasDaAeronave.slice(0, idx);
  // Esta é a regra de negócio: não é possível iniciar uma etapa se as anteriores não estiverem concluídas.
  const pendentesAnteriores = anteriores.filter((x) => x.status !== StatusEtapa.CONCLUIDA);
  if (pendentesAnteriores.length > 0) {
    console.log("❌ Não é possível iniciar: há etapas anteriores não concluídas.");
    return;
  }

  etapa.status = StatusEtapa.ANDAMENTO;
  await salvarTodos();
  console.log("✅ Etapa iniciada.");
}

// Lógica para finalizar uma etapa.
async function finalizarEtapa() {
  if (!exigirNivel([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO])()) return;
  console.log("\n_________________________");
  console.log("\n___ Finalizar Etapa ___");
  console.log("__________________________");
  const nomeEtapa = await perguntar("Nome da etapa: ");
  const etapa = etapas.find((e) => e.nome === nomeEtapa);
  if (!etapa) {
    console.log("❌ Etapa não encontrada.");
    return;
  }
  // Só permite finalizar se a etapa estiver em andamento.
  if (etapa.status !== StatusEtapa.ANDAMENTO) {
    console.log("❌ Etapa não está em andamento e não pode ser finalizada.");
    return;
  }
  etapa.status = StatusEtapa.CONCLUIDA;
  await salvarTodos();
  console.log("✅ Etapa finalizada.");
}

// --- Testes ---

// Lógica para registrar um teste.
async function cadastrarTeste() {
  if (!exigirNivel([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR])()) return;
  console.log("\n__________________________");
  console.log("\n___ Cadastro de Teste ___");
  console.log("1. Elétrico");
  console.log("2. Hidráulico");
  console.log("3. Aerodinâmico");
  console.log("____________________________");
  const tipoStr: string = await perguntar("Escolha o tipo: ");
  let tipo: TipoTeste;
  switch (tipoStr) {
    case "1":
      tipo = TipoTeste.ELETRICO;
      break;
    case "2":
      tipo = TipoTeste.HIDRAULICO;
      break;
    case "3":
      tipo = TipoTeste.AERODINAMICO;
      break;
    default:
      console.log("❌ Tipo inválido!");
      return;
  }

  console.log("\nResultado do teste:");
  console.log("1. Aprovado");
  console.log("2. Reprovado");
  const resStr: string = await perguntar("Digite o resultado: ");
  let resultado: ResultadoTeste;
  if (resStr === "1") resultado = ResultadoTeste.APROVADO;
  else if (resStr === "2") resultado = ResultadoTeste.REPROVADO;
  else {
    console.log("❌ Resultado inválido!");
    return;
  }

  const aeronaveCodigo = await perguntar("Código da aeronave testada: ");
  if (!aeronaves.find((a) => a.codigo === aeronaveCodigo)) {
    console.log("❌ Aeronave não encontrada!");
    return;
  }

  let t: any;
  try {
    t = new Teste(tipo, resultado);
    t.aeronaveCodigo = aeronaveCodigo;
    t.data = new Date().toISOString();
  } catch (err) {
    t = { tipo, resultado, aeronaveCodigo, data: new Date().toISOString() };
  }

  testes.push(t);
  await salvarTodos();
  console.log("✅ Teste registrado com sucesso!");
}

// --- Relatório final (salva em arquivo de texto) ---

// Lógica para gerar um relatório final de uma aeronave.
async function gerarRelatorio() {
  console.log("\n_____________________________");
  console.log("\n___ Gerar Relatório Final ___");
  const codigo = await perguntar("Código da aeronave para gerar relatório: ");
  console.log("_______________________________");
  const aeronave = aeronaves.find((a) => a.codigo === codigo);
  if (!aeronave) {
    console.log("❌ Aeronave não encontrada.");
    return;
  }

  // Filtra todas as informações (peças, etapas, testes) relacionadas à aeronave.
  const pecasDaAeronave = pecas.filter((p) => p.aeronaveCodigo === codigo);
  const etapasDaAeronave = etapas.filter((e) => e.aeronaveCodigo === codigo);
  const testesDaAeronave = testes.filter((t) => t.aeronaveCodigo === codigo);

  // Monta o conteúdo do relatório linha por linha.
  const lines: string[] = [];
  lines.push("___ Relatório Final de Aeronave ___");
  lines.push(`Gerado em: ${new Date().toLocaleString()}`);
  lines.push("");
  lines.push("___ Aeronave ___");
  lines.push(`Código: ${aeronave.codigo}`);
  lines.push(`Modelo: ${aeronave.modelo}`);
  lines.push(`Tipo: ${aeronave.tipo}`);
  lines.push(`Capacidade: ${aeronave.capacidade}`);
  lines.push(`Alcance: ${aeronave.alcance}`);
  lines.push("");

  lines.push("__ Peças __");
  if (pecasDaAeronave.length === 0) lines.push("Nenhuma peça associada.");
  else pecasDaAeronave.forEach((p, i) => {
    lines.push(`${i + 1}. Nome: ${p.nome}  Tipo: ${p.tipo}  Fornecedor: ${p.fornecedor}  Status: ${p.status}`);
  });
  lines.push("");

  lines.push("__ Etapas __");
  if (etapasDaAeronave.length === 0) lines.push("Nenhuma etapa.");
  else etapasDaAeronave.forEach((e, i) => {
    lines.push(`${i + 1}. Nome: ${e.nome}  Prazo: ${e.prazo}  Status: ${e.status}`);
    lines.push(`   Funcionários: ${e.funcionarios?.map((f: any) => f.nome || f.id || f).join(", ") || "Nenhum"}`);
  });
  lines.push("");

  lines.push("__ Testes __");
  if (testesDaAeronave.length === 0) lines.push("Nenhum teste registrado.");
  else testesDaAeronave.forEach((t, i) => {
    lines.push(`${i + 1}. Tipo: ${t.tipo}  Resultado: ${t.resultado}  Data: ${t.data || "N/A"}`);
  });

  const relatorioTxt = lines.join("\n");
  const outFile = path.join(DATA_DIR, `relatorio_${codigo}.txt`);
  await fs.writeFile(outFile, relatorioTxt, "utf-8");
  console.log(`✅ Relatório salvo em ${outFile}`);

  const cliente = await perguntar("Nome do cliente: ");
  const dataEntrega = await perguntar("Data de entrega (ex: 2025-10-04): ");

  try {
    // Cria uma instância da classe Relatorio para persistir os dados de forma estruturada.
    const r = new Relatorio(aeronave, pecasDaAeronave, etapasDaAeronave, testesDaAeronave, cliente, dataEntrega);
    if (typeof r.salvarEmArquivo === "function") {
      r.salvarEmArquivo(outFile);
    }
  } catch (err) {
    // Apenas ignora se a classe Relatorio não tiver o método 'salvarEmArquivo'.
  }
}

// --- Carregar dados antes de iniciar ---

// Função assíncrona auto-executável para carregar os dados no início da aplicação.
(async () => {
  await carregarTodos();
})();

// Lógica para listar as etapas de uma aeronave específica.
async function listarEtapasDaAeronave() {
  const codigo = await perguntar("Código da aeronave: ");
  const etapasDaAeronave = etapas.filter((e) => e.codigoAeronave === codigo);
  if (etapasDaAeronave.length === 0) {
    console.log("Nenhuma etapa encontrada para esta aeronave.");
    return;
  }
  etapasDaAeronave.forEach((e, i) => {
    console.log(`${i + 1}. Nome: ${e.nome} | Prazo: ${e.prazo} | Status: ${e.status} | Funcionários: ${e.funcionarios?.map((f: any) => f.nome || f.id || f).join(", ") || "Nenhum"}`);
  });
}

// Lógica para associar um funcionário a uma etapa.
async function associarFuncionarioEtapa() {
  const nomeEtapa = await perguntar("Nome da etapa: ");
  const etapa = etapas.find((e) => e.nome === nomeEtapa);
  if (!etapa) {
    console.log("❌ Etapa não encontrada.");
    return;
  }
  const idFuncionario = await perguntar("ID do funcionário para associar: ");
  const funcionario = funcionarios.find((f) => f.id === idFuncionario);
  if (!funcionario) {
    console.log("❌ Funcionário não encontrado.");
    return;
  }
  if (!etapa.funcionarios) etapa.funcionarios = [];
  // Evita a duplicação de funcionários na mesma etapa.
  if (etapa.funcionarios.find((f: any) => f.id === funcionario.id)) {
    console.log("Funcionário já está associado a esta etapa.");
    return;
  }
  etapa.funcionarios.push(funcionario);
  await salvarTodos();
  console.log("✅ Funcionário associado à etapa.");
}

// --- Menu principal ---

// Função principal que exibe o menu e gerencia as opções do usuário.
async function menu() {
  console.log("\n=== Sistema de Produção de Aeronaves (Aerocode) ===");
  console.log("Usuário atual:", currentUser ? `${currentUser.nome} (${currentUser.usuario})` : "Nenhum");
  console.log("1. Login");
  console.log("2. Cadastrar Funcionário");
  console.log("3. Cadastrar Aeronave");
  console.log("4. Listar Aeronaves");
  console.log("5. Cadastrar Peça");
  console.log("6. Atualizar Status da Peça");
  console.log("7. Cadastrar Etapa");
  console.log("8. Listar Etapas de Aeronave");
  console.log("9. Associar Funcionário a Etapa");
  console.log("10. Iniciar Etapa");
  console.log("11. Finalizar Etapa");
  console.log("12. Registrar Teste");
  console.log("13. Gerar Relatório Final (arquivo)");
  console.log("14. Salvar todos os dados");
  console.log("0. Sair");

  const opcao = await perguntar("Escolha: ");
  // Utiliza um switch para direcionar a execução com base na opção do usuário.
  switch (opcao) {
    case "1":
      await autenticarCLI();
      break;
    case "2":
      await cadastrarFuncionarioCLI();
      break;
    case "3":
      await cadastrarAeronave();
      break;
    case "4":
      listarAeronaves();
      break;
    case "5":
      await cadastrarPeca();
      break;
    case "6":
      await atualizarStatusPeca();
      break;
    case "7":
      await cadastrarEtapa();
      break;
    case "8":
      await listarEtapasDaAeronave();
      break;
    case "9":
      await associarFuncionarioEtapa();
      break;
    case "10":
      await iniciarEtapa();
      break;
    case "11":
      await finalizarEtapa();
      break;
    case "12":
      await cadastrarTeste();
      break;
    case "13":
      await gerarRelatorio();
      break;
    case "14":
      await salvarTodos();
      console.log("✅ Dados salvos.");
      break;
    case "0":
      console.log("Saindo...");
      rl.close(); // Fecha a interface do readline para encerrar a aplicação.
      return;
    default:
      console.log("Opção inválida.");
  }

  // A recursividade desta chamada faz com que o menu se repita até que o usuário escolha sair.
  await menu();
}

// Inicia a aplicação chamando a função do menu principal.
menu();