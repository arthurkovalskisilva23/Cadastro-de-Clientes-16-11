import { Cliente } from "./Cliente.js";
import { CadastroClientes } from "./cadastroClientes.js";

const cadastro = new CadastroClientes();

const formulario = document.getElementById("formCliente");
const lista = document.getElementById("listaClientes");
const pesquisa = document.getElementById("pesquisa");
const mensagemVazia = document.getElementById("mensagemVazia");
const campoId = document.getElementById("clienteId");
const botaoSalvar = document.getElementById("btnSalvar");
const totalClientes = document.getElementById("totalClientes");

function limparFormulario() {
    formulario.reset();
    campoId.value = "";
    botaoSalvar.textContent = "Salvar cliente";
}

function renderizarClientes(filtro = "") {
    lista.innerHTML = "";

    const termo = filtro.toLowerCase().trim();

    // Atualiza a quantidade total de clientes
    totalClientes.textContent = cadastro.clientes.length;

    // Organiza os clientes em ordem alfabética
    const clientesOrdenados = [...cadastro.clientes].sort(
        (a, b) => a.nome.localeCompare(b.nome, "pt-BR", {
            sensitivity: "base"
        })
    );

    // Aplica o filtro de pesquisa
    const clientesFiltrados = clientesOrdenados.filter(cliente =>
        cliente.nome.toLowerCase().includes(termo) ||
        cliente.email.toLowerCase().includes(termo)
    );

    mensagemVazia.hidden = clientesFiltrados.length > 0;

    clientesFiltrados.forEach(cliente => {
        const linha = document.createElement("tr");

        [
            cliente.nome,
            cliente.email,
            cliente.cpf || "-",
            cliente.telefone,
            cliente.cidade
        ].forEach(valor => {
            const celula = document.createElement("td");
            celula.textContent = valor || "-";
            linha.appendChild(celula);
        });

        const acoes = document.createElement("td");

        // Botão editar
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.className = "editar";
        btnEditar.type = "button";

        btnEditar.addEventListener("click", () => {
            carregarParaEdicao(cliente.id);
        });

        // Botão excluir
        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.className = "excluir";
        btnExcluir.type = "button";

        btnExcluir.addEventListener("click", () => {
            const confirmou = confirm(
                "Deseja realmente excluir este cliente?"
            );

            if (confirmou) {
                cadastro.excluir(cliente.id);
                renderizarClientes(pesquisa.value);
                limparFormulario();
            }
        });

        acoes.append(btnEditar, btnExcluir);
        linha.appendChild(acoes);
        lista.appendChild(linha);
    });
}

function carregarParaEdicao(id) {
    const cliente = cadastro.buscarPorId(id);

    if (!cliente) {
        alert("Cliente não encontrado.");
        return;
    }

    campoId.value = cliente.id;

    document.getElementById("nome").value = cliente.nome;
    document.getElementById("email").value = cliente.email;
    document.getElementById("cpf").value = cliente.cpf || "";
    document.getElementById("telefone").value = cliente.telefone;
    document.getElementById("cidade").value = cliente.cidade;

    botaoSalvar.textContent = "Atualizar cliente";

    document.getElementById("nome").focus();
}

// Cadastro e atualização
formulario.addEventListener("submit", event => {
    event.preventDefault();

    const id = campoId.value;

    const dados = {
        nome: document.getElementById("nome").value.trim(),
        email: document.getElementById("email").value.trim(),
        cpf: document.getElementById("cpf").value.trim(),
        telefone: document.getElementById("telefone").value.trim(),
        cidade: document.getElementById("cidade").value.trim()
    };

    if (!dados.nome || !dados.email) {
        alert("Preencha o nome e o e-mail.");
        return;
    }

    // Verifica e-mails duplicados
    if (cadastro.emailExiste(dados.email, id || null)) {
        alert("Este e-mail já está cadastrado para outro cliente!");
        document.getElementById("email").focus();
        return;
    }

    if (id) {
        const atualizou = cadastro.atualizar(id, dados);

        if (atualizou) {
            alert("Cliente atualizado com sucesso!");
        } else {
            alert("Não foi possível atualizar o cliente.");
            return;
        }

    } else {
        const novoCliente = new Cliente(
            Date.now().toString(),
            dados.nome,
            dados.email,
            dados.telefone,
            dados.cidade,
            dados.cpf
        );

        const adicionado = cadastro.adicionar(novoCliente);

        if (adicionado) {
            alert("Cliente cadastrado com sucesso!");
        } else {
            alert("Este e-mail já está cadastrado!");
            return;
        }
    }

    limparFormulario();
    renderizarClientes(pesquisa.value);
});

// Botão limpar formulário
document.getElementById("btnLimpar")
    .addEventListener("click", limparFormulario);

// Pesquisa de clientes
pesquisa.addEventListener("input", () => {
    renderizarClientes(pesquisa.value);
});

// Limpar todos os registros
document.getElementById("btnLimparTodos")
    .addEventListener("click", () => {

        if (cadastro.clientes.length === 0) {
            alert("Não existem clientes cadastrados.");
            return;
        }

        const confirmou = confirm(
            "ATENÇÃO!\n\nDeseja realmente excluir TODOS os clientes cadastrados? Esta ação não poderá ser desfeita."
        );

        if (confirmou) {
            cadastro.limparTodos();
            limparFormulario();
            pesquisa.value = "";
            renderizarClientes();

            alert("Todos os registros foram excluídos com sucesso!");
        }
    });

// Exibição inicial
renderizarClientes();

