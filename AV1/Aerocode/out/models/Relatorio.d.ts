import { Aeronave } from "./Aeronave.js";
import { Peca } from "./Peca.js";
import { Etapa } from "./Etapa.js";
import { Teste } from "./Teste.js";
declare class Relatorio {
    aeronave: Aeronave;
    pecas: Peca[];
    etapas: Etapa[];
    testes: Teste[];
    cliente: string;
    dataEntrega: string;
    constructor(aeronave: Aeronave, pecas: Peca[], etapas: Etapa[], testes: Teste[], cliente: string, dataEntrega: string);
    gerarTexto(): string;
    salvarEmArquivo(caminho: string): void;
}
export { Relatorio };
//# sourceMappingURL=Relatorio.d.ts.map