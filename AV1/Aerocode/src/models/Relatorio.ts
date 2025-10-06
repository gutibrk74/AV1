// filepath: e:\Fatec\3 SEMESTRE\PO\AV1\AeroCode\src\models\Relatorio.ts
import { Aeronave } from "./Aeronave.js";
import { Peca } from "./Peca.js";
import { Etapa } from "./Etapa.js";
import { Teste } from "./Teste.js";
import * as fs from "fs";

class Relatorio {
  aeronave: Aeronave;
  pecas: Peca[];
  etapas: Etapa[];
  testes: Teste[];
  cliente: string;
  dataEntrega: string;

  constructor(aeronave: Aeronave, pecas: Peca[], etapas: Etapa[], testes: Teste[], cliente: string, dataEntrega: string) {
    this.aeronave = aeronave;
    this.pecas = pecas;
    this.etapas = etapas;
    this.testes = testes;
    this.cliente = cliente;
    this.dataEntrega = dataEntrega;
  }

  gerarTexto(): string {
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

  salvarEmArquivo(caminho: string) {
    const conteudo = this.gerarTexto();
    fs.writeFileSync(caminho, conteudo, "utf-8");
    console.log(`Relatório salvo em ${caminho}`);
  }
}

export { Relatorio };