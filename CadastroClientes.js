import { Cliente } from "./Cliente.js";

export class CadastroClientes {
    constructor() {
        this.clientes = this.carregar();
    }

    carregar() {
        const dados = JSON.parse(
            localStorage.getItem("clientes")
        ) || [];

        return dados.map(item => new Cliente(
            item.id,
            item.nome,
            item.email,
            item.telefone,
            item.cidade,
            item.cpf || ""
        ));
    }

    salvarNoNavegador() {
        localStorage.setItem(
            "clientes",
            JSON.stringify(this.clientes)
        );
    }

    adicionar(cliente) {
        if (this.emailExiste(cliente.email)) {
            return false;
        }

        this.clientes.push(cliente);
        this.salvarNoNavegador();
        return true;
    }

    buscarPorId(id) {
        return this.clientes.find(
            cliente => cliente.id === id
        );
    }

    emailExiste(email, idIgnorado = null) {
        const emailNormalizado = email.trim().toLowerCase();

        return this.clientes.some(cliente =>
            cliente.id !== idIgnorado &&
            cliente.email.trim().toLowerCase() === emailNormalizado
        );
    }

    atualizar(id, dados) {
        const cliente = this.buscarPorId(id);

        if (!cliente) {
            return false;
        }

        if (this.emailExiste(dados.email, id)) {
            return false;
        }

        cliente.atualizar(
            dados.nome,
            dados.email,
            dados.telefone,
            dados.cidade,
            dados.cpf
        );

        this.salvarNoNavegador();
        return true;
    }

    excluir(id) {
        this.clientes = this.clientes.filter(
            cliente => cliente.id !== id
        );

        this.salvarNoNavegador();
    }

    limparTodos() {
        this.clientes = [];
        this.salvarNoNavegador();
    }
}


pesquisa.addEventListener("input", () => {
    renderizarClientes(pesquisa.value);
});

renderizarClientes();

function pesquisarCliente() {
    const termo = pesquisa.value.trim();
    renderizarClientes(termo);
}
