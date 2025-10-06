import { TipoAeronave } from "../enums/TipoAeronave.js";

/**
 * Classe que representa uma Aeronave
 */
class Aeronave {
  // Conjunto para garantir que não haja códigos duplicados
  private static codigosUsados = new Set<string>();

  // Array estático simulando um "banco de dados" em memória
  private static armazenamento: Aeronave[] = [];

  // Atributos da aeronave
  codigo: string;
  modelo: string;
  tipo: TipoAeronave;
  capacidade: number;
  alcance: number;

  /**
   * Construtor da classe Aeronave
   *  codigo Código único da aeronave
   *  modelo Modelo da aeronave
   *  tipo Tipo da aeronave (Comercial/Militar)
   *  capacidade Capacidade de passageiros
   *  alcance Alcance em km
   */
  
  constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number) {
    // Impede a criação de aeronaves com código duplicado
    if (Aeronave.codigosUsados.has(codigo)) {
      throw new Error(`Código '${codigo}' já está em uso!`);
    }

    this.codigo = codigo;
    this.modelo = modelo;
    this.tipo = tipo;
    this.capacidade = capacidade;
    this.alcance = alcance;

    // Marca o código como já utilizado
    Aeronave.codigosUsados.add(codigo);
  }

  /**
   * Retorna uma descrição detalhada da aeronave
   */
  detalhes(): string {
    return `Aeronave ${this.codigo} - ${this.modelo}
  Tipo: ${TipoAeronave[this.tipo]}
  Capacidade: ${this.capacidade}
  Alcance: ${this.alcance}`;
  }

  /**
   * Salva a aeronave no "banco de dados" (array em memória)
   */
  salvar(): void {
    Aeronave.armazenamento.push(this);
  }

  /**
   * Busca uma aeronave pelo código
   *  codigo Código da aeronave
   * return A instância da aeronave ou undefined
   */
  static carregar(codigo: string): Aeronave | undefined {
    return Aeronave.armazenamento.find(a => a.codigo === codigo);
  }

  /**
   * Lista todas as aeronaves salvas no sistema
   */
  static listarTodas(): Aeronave[] {
    return [...Aeronave.armazenamento]; // retorna uma cópia do array
  }
}

export { Aeronave };
