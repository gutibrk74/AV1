import { NivelPermissao } from "../enums/NivelPermissao";
declare class Funcionario {
    id: string;
    nome: string;
    telefone: string;
    endereco: string;
    usuario: string;
    senha: string;
    nivelPermissao: NivelPermissao;
    constructor(id: string, nome: string, telefone: string, endereco: string, usuario: string, senha: string, nivelPermissao: NivelPermissao);
    autenticar(usuario: string, senha: string): boolean;
}
export { Funcionario };
//# sourceMappingURL=Funcionario.d.ts.map