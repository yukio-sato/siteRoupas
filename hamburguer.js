function Menu() {
    const topicos = document.getElementById("topicos");
    const body = document.body;

    if (topicos.classList.contains("show")) {
        topicos.classList.remove("show");
        body.classList.remove("menu-open");
    } else {
        topicos.classList.add("show");
        body.classList.add("menu-open");
    }
}

// function buy(id){
//     var send = { "id":id};
//     var sendString = JSON.stringify(send);
//     // alert(sendString);
//     xhttp.send(send);
//     window.location.href = "/produto.ejs";
// }