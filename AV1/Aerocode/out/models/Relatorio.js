"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relatorio = void 0;
const fs = require("fs");
class Relatorio {
    aeronave;
    pecas;
    etapas;
    testes;
    cliente;
    dataEntrega;
    constructor(aeronave, pecas, etapas, testes, cliente, dataEntrega) {
        this.aeronave = aeronave;
        this.pecas = pecas;
        this.etapas = etapas;
        this.testes = testes;
        this.cliente = cliente;
        this.dataEntrega = dataEntrega;
    }
    gerarTexto() {
        let rel = `=== Relatório Final da Aeronave ===\n\n`;
        rel += `Cliente: ${this.cliente}\n`;
        rel += `Data de entrega: ${this.dataEntrega}\n`;
        rel += `Código: ${this.aeronave.codigo}\n`;
        rel += `Modelo: ${this.aeronave.modelo}\n`;
        rel += `Tipo: ${this.aeronave.tipo}\n`;
        rel += `Capacidade: ${this.aeronave.capacidade}\n`;
        rel += `Alcance: ${this.aeronave.alcance}\n\n`;
        rel += `--- Peças ---\n`;
        this.pecas.forEach((p, i) => {
            rel += `${i + 1}. ${p.nome} | Tipo: ${p.tipo} | Fornecedor: ${p.fornecedor} | Status: ${p.status}\n`;
        });
        rel += `\n--- Etapas ---\n`;
        this.etapas.forEach((e, i) => {
            rel += `${i + 1}. ${e.nome} | Prazo: ${e.prazo} dias | Status: ${e.status} | Funcionários: ${e.funcionarios?.map(f => f.nome).join(", ") || "Nenhum"}\n`;
        });
        rel += `\n--- Testes ---\n`;
        this.testes.forEach((t, i) => {
            rel += `${i + 1}. ${t.tipo} | Resultado: ${t.resultado ?? "Não registrado"}\n`;
        });
        return rel;
    }
    salvarEmArquivo(caminho) {
        const conteudo = this.gerarTexto();
        fs.writeFileSync(caminho, conteudo, "utf-8");
        console.log(`Relatório salvo em ${caminho}`);
    }
}
exports.Relatorio = Relatorio;
//# sourceMappingURL=Relatorio.js.map