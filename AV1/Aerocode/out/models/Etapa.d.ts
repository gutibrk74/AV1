import { StatusEtapa } from "../enums/StatusEtapa.js";
import { Funcionario } from "./Funcionario.js";
declare class Etapa {
    codigoAeronave: string;
    nome: string;
    prazo: string | number;
    status: StatusEtapa;
    funcionarios: Funcionario[];
    constructor(codigoAeronave: string, nome: string, prazo: number);
    iniciar(): void;
    finalizar(): void;
    associarFuncionario(funcionario: Funcionario): void;
    listarFuncionarios(): Funcionario[];
}
export { Etapa };
//# sourceMappingURL=Etapa.d.ts.map