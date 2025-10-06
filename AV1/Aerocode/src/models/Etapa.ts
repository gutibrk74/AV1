import { StatusEtapa } from "../enums/StatusEtapa.js";
import { Funcionario } from "./Funcionario.js";

class Etapa {
  codigoAeronave: string;
  nome: string;
  prazo: string | number;
  status: StatusEtapa;
  funcionarios: Funcionario[];

  constructor(codigoAeronave: string, nome: string, prazo: number) {
    this.codigoAeronave = codigoAeronave;
    this.nome = nome;
    this.prazo = prazo;
    this.status = StatusEtapa.PENDENTE;
    this.funcionarios = [];
  }

  iniciar() {
    if (this.status !== StatusEtapa.PENDENTE) {
      throw new Error(`Etapa '${this.nome}' já foi iniciada ou concluída.`);
    }
    this.status = StatusEtapa.ANDAMENTO;
  }

  finalizar() {
    if (this.status !== StatusEtapa.ANDAMENTO) {
      throw new Error(`Etapa '${this.nome}' não pode ser concluída pois não está em andamento.`);
    }
    this.status = StatusEtapa.CONCLUIDA;
  }

  associarFuncionario(funcionario: Funcionario) {
    if (!this.funcionarios.find(f => f.id === funcionario.id)) {
      this.funcionarios.push(funcionario);
    }
  }

  listarFuncionarios(): Funcionario[] {
    return this.funcionarios;
  }
}

export { Etapa };