import { TipoAeronave } from "../enums/TipoAeronave.js";
/**
 * Classe que representa uma Aeronave
 */
declare class Aeronave {
    private static codigosUsados;
    private static armazenamento;
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
    constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number);
    /**
     * Retorna uma descrição detalhada da aeronave
     */
    detalhes(): string;
    /**
     * Salva a aeronave no "banco de dados" (array em memória)
     */
    salvar(): void;
    /**
     * Busca uma aeronave pelo código
     *  codigo Código da aeronave
     * return A instância da aeronave ou undefined
     */
    static carregar(codigo: string): Aeronave | undefined;
    /**
     * Lista todas as aeronaves salvas no sistema
     */
    static listarTodas(): Aeronave[];
}
export { Aeronave };
//# sourceMappingURL=Aeronave.d.ts.map