const campoBusca = document.getElementById("campoBusca");
const btnBuscar = document.getElementById("btnBuscar");
const mensagemValidacao = document.getElementById("mensagemValidacao");
const resultadoBusca = document.getElementById("resultadoBusca");
const listaFavoritos = document.getElementById("listaFavoritos");

const URL_API = "https://jsonplaceholder.typicode.com/posts";

document.addEventListener("DOMContentLoaded", function () {
  carregarFavoritos();
});

btnBuscar.addEventListener("click", function () {
  buscarConteudos();
});

campoBusca.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    buscarConteudos();
  }
});

function buscarConteudos() {
  const termo = campoBusca.value.trim();

  resultadoBusca.innerHTML = "";
  mensagemValidacao.textContent = "";

  if (termo === "") {
    mensagemValidacao.textContent = "O campo de busca não pode estar vazio.";
    return;
  }

  if (termo.length < 3) {
    mensagemValidacao.textContent = "Digite no mínimo 3 caracteres para realizar a busca.";
    return;
  }

  mensagemValidacao.textContent = "Buscando conteúdos...";

  fetch(`${URL_API}?q=${encodeURIComponent(termo)}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (dados) {
      mensagemValidacao.textContent = "";

      if (dados.length === 0) {
        resultadoBusca.innerHTML = "<p>Nenhum conteúdo encontrado.</p>";
        return;
      }

      mostrarResultados(dados);
    })
    .catch(function () {
      mensagemValidacao.textContent = "Erro ao buscar dados na API.";
    });
}

function mostrarResultados(dados) {
  resultadoBusca.innerHTML = "";

  dados.forEach(function (item) {
    const card = document.createElement("div");
    card.classList.add("card-resultado");

    const titulo = document.createElement("h3");
    titulo.textContent = item.title;

    const conteudo = document.createElement("p");
    conteudo.textContent = item.body;

    const botaoFavorito = document.createElement("button");
    botaoFavorito.textContent = "Salvar favorito";

    botaoFavorito.addEventListener("click", function () {
      salvarFavorito(item);
    });

    card.appendChild(titulo);
    card.appendChild(conteudo);
    card.appendChild(botaoFavorito);

    resultadoBusca.appendChild(card);
  });
}

function salvarFavorito(item) {
  let favoritos = buscarFavoritosSalvos();

  const jaExiste = favoritos.some(function (favorito) {
    return favorito.id === item.id;
  });

  if (jaExiste) {
    mensagemValidacao.textContent = "Esse conteúdo já está salvo nos favoritos.";
    return;
  }

  const novoFavorito = {
    id: item.id,
    title: item.title,
    body: item.body
  };

  favoritos.push(novoFavorito);

  localStorage.setItem("favoritosSAP", JSON.stringify(favoritos));

  mensagemValidacao.textContent = "Conteúdo salvo nos favoritos.";

  carregarFavoritos();
}

function carregarFavoritos() {
  let favoritos = buscarFavoritosSalvos();

  listaFavoritos.innerHTML = "";

  if (favoritos.length === 0) {
    listaFavoritos.innerHTML = "<p>Nenhum favorito salvo ainda.</p>";
    return;
  }

  favoritos.forEach(function (item) {
    const card = document.createElement("div");
    card.classList.add("card-resultado");

    const titulo = document.createElement("h3");
    titulo.textContent = item.title;

    const conteudo = document.createElement("p");
    conteudo.textContent = item.body;

    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover favorito";
    botaoRemover.classList.add("remover");

    botaoRemover.addEventListener("click", function () {
      removerFavorito(item.id);
    });

    card.appendChild(titulo);
    card.appendChild(conteudo);
    card.appendChild(botaoRemover);

    listaFavoritos.appendChild(card);
  });
}

function removerFavorito(id) {
  let favoritos = buscarFavoritosSalvos();

  favoritos = favoritos.filter(function (item) {
    return item.id !== id;
  });

  localStorage.setItem("favoritosSAP", JSON.stringify(favoritos));

  mensagemValidacao.textContent = "Favorito removido.";

  carregarFavoritos();
}

function buscarFavoritosSalvos() {
  return JSON.parse(localStorage.getItem("favoritosSAP")) || [];
}
