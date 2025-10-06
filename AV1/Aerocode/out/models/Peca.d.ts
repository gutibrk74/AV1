import { TipoPeca } from "../enums/TipoPeca.js";
import { StatusPeca } from "../enums/StatusPeca.js";
declare class Peca {
    nome: string;
    tipo: TipoPeca;
    fornecedor: string;
    status: StatusPeca;
    constructor(nome: string, tipo: TipoPeca, fornecedor: string, status?: StatusPeca);
    atualizarStatus(novo: StatusPeca): void;
}
export { Peca };
//# sourceMappingURL=Peca.d.ts.map