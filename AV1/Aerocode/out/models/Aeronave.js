"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aeronave = void 0;
const TipoAeronave_js_1 = require("../enums/TipoAeronave.js");
/**
 * Classe que representa uma Aeronave
 */
class Aeronave {
    // Conjunto para garantir que não haja códigos duplicados
    static codigosUsados = new Set();
    // Array estático simulando um "banco de dados" em memória
    static armazenamento = [];
    // Atributos da aeronave
    codigo;
    modelo;
    tipo;
    capacidade;
    alcance;
    /**
     * Construtor da classe Aeronave
     *  codigo Código único da aeronave
     *  modelo Modelo da aeronave
     *  tipo Tipo da aeronave (Comercial/Militar)
     *  capacidade Capacidade de passageiros
     *  alcance Alcance em km
     */
    constructor(codigo, modelo, tipo, capacidade, alcance) {
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
    detalhes() {
        return `Aeronave ${this.codigo} - ${this.modelo}
  Tipo: ${TipoAeronave_js_1.TipoAeronave[this.tipo]}
  Capacidade: ${this.capacidade}
  Alcance: ${this.alcance}`;
    }
    /**
     * Salva a aeronave no "banco de dados" (array em memória)
     */
    salvar() {
        Aeronave.armazenamento.push(this);
    }
    /**
     * Busca uma aeronave pelo código
     *  codigo Código da aeronave
     * return A instância da aeronave ou undefined
     */
    static carregar(codigo) {
        return Aeronave.armazenamento.find(a => a.codigo === codigo);
    }
    /**
     * Lista todas as aeronaves salvas no sistema
     */
    static listarTodas() {
        return [...Aeronave.armazenamento]; // retorna uma cópia do array
    }
}
exports.Aeronave = Aeronave;
//# sourceMappingURL=Aeronave.js.map