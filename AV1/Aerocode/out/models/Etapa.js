"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Etapa = void 0;
const StatusEtapa_js_1 = require("../enums/StatusEtapa.js");
class Etapa {
    codigoAeronave;
    nome;
    prazo;
    status;
    funcionarios;
    constructor(codigoAeronave, nome, prazo) {
        this.codigoAeronave = codigoAeronave;
        this.nome = nome;
        this.prazo = prazo;
        this.status = StatusEtapa_js_1.StatusEtapa.PENDENTE;
        this.funcionarios = [];
    }
    iniciar() {
        if (this.status !== StatusEtapa_js_1.StatusEtapa.PENDENTE) {
            throw new Error(`Etapa '${this.nome}' já foi iniciada ou concluída.`);
        }
        this.status = StatusEtapa_js_1.StatusEtapa.ANDAMENTO;
    }
    finalizar() {
        if (this.status !== StatusEtapa_js_1.StatusEtapa.ANDAMENTO) {
            throw new Error(`Etapa '${this.nome}' não pode ser concluída pois não está em andamento.`);
        }
        this.status = StatusEtapa_js_1.StatusEtapa.CONCLUIDA;
    }
    associarFuncionario(funcionario) {
        if (!this.funcionarios.find(f => f.id === funcionario.id)) {
            this.funcionarios.push(funcionario);
        }
    }
    listarFuncionarios() {
        return this.funcionarios;
    }
}
exports.Etapa = Etapa;
//# sourceMappingURL=Etapa.js.map