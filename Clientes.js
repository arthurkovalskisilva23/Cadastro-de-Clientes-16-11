export class Cliente {
    constructor(id, nome, email, telefone, cidade, cpf = "") {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cidade = cidade;
        this.cpf = cpf;
    }

    atualizar(nome, email, telefone, cidade, cpf = "") {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cidade = cidade;
        this.cpf = cpf;
    }
}
