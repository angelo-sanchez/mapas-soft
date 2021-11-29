var socket = io.connect("http://localhost:8080", { forceNew: true });

function render() {
    var html = data
    .map(function (elem, index){
        return `<div>
                <strong>${data.owner}</strong>:
                <em>${data.name}</em>
                </div>`;
    })
    .join(" ");
    document.getElementById('mapas').innerHTML = html;
}

socket.on("mapas", function (data) {
    console.log(data);
  });
