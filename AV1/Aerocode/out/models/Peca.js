"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Peca = void 0;
const StatusPeca_js_1 = require("../enums/StatusPeca.js");
class Peca {
    nome;
    tipo;
    fornecedor;
    status;
    constructor(nome, tipo, fornecedor, status = StatusPeca_js_1.StatusPeca.PRODUCAO) {
        this.nome = nome;
        this.tipo = tipo;
        this.fornecedor = fornecedor;
        this.status = status;
    }
    atualizarStatus(novo) {
        this.status = novo;
    }
}
exports.Peca = Peca;
//# sourceMappingURL=Peca.js.map