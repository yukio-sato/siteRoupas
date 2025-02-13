var corSelecionada = '';
var tamanhoSelecionado = '';
var produto = '';

document.addEventListener("DOMContentLoaded", () => {
  produto = document.getElementById("product").textContent;
  // Seleciona todos os botões de tamanho
  const sizeButtons = document.querySelectorAll(".size");

  // Seleciona todos os botões de cor
  const colorButtons = document.querySelectorAll(".color");

  // Seleciona todas as imagens
  const imgUrl = document.querySelectorAll(".C-ImgBig");

  // Adiciona evento de clique aos botões de tamanho
  sizeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove a classe 'selected' de todos os botões de tamanho
      sizeButtons.forEach((btn) => btn.classList.remove("selected"));
      // Adiciona a classe 'selected' ao botão de tamanho clicado
      button.classList.add("selected");
      tamanhoSelecionado = button.textContent;
    });
  });

  // Adiciona evento de clique aos botões de cor
  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove a classe 'selected' de todos os botões de cor
      colorButtons.forEach((btn) => btn.classList.remove("selected"));
      // Adiciona a classe 'selected' ao botão de cor clicado
      button.classList.add("selected");
      corSelecionada = button.textContent;
      var imgAnterior;
      imgUrl.forEach((imageTag) => { if(imageTag.getAttribute("hidden") == null){ imgAnterior = imageTag.id } });
      var selectedImg = document.getElementById(button.id);
      if (selectedImg.getAttribute("src") != null && imgAnterior != selectedImg){
        imgUrl.forEach((imageTag) => imageTag.setAttribute("hidden",''));
        selectedImg.removeAttribute("hidden");
      }
    });
  });
  document.getElementById("end").addEventListener("click", function () {
    if (!tamanhoSelecionado || !corSelecionada) {
        alert("Por favor, selecione um tamanho e uma cor antes de finalizar a compra!");
        return;
    }

    let numeroLoja = "5513996718928"; // Substitua pelo número correto da loja
    let mensagem = `Olá, gostaria de saber se a peça de roupa ${produto} do tamanho ${tamanhoSelecionado} na cor ${corSelecionada} está disponível.`;
    let linkWhatsApp = `https://api.whatsapp.com/send?phone=${numeroLoja}&text=${encodeURIComponent(mensagem)}`;

    // window.open(linkWhatsApp, "_blank");
    alert(mensagem);
  });
});