window.getCookie = (name) => {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) 
        return match[2];
    

}

const server = "http://localhost:25566/";
const canvas = document.querySelector(`#main-canvas`);

const currentTemplate = () => ``;

function enlistMods(mods) {
    return "mock";
}

const availableTemplate = (id, name, meta, img, mods) => 
`<div>
${id == 0 ? '' : '<hr color="black" noshade>'}
<h2 class='a-server-name'>${name}</h2>
<img class="a-server-img" src="data:image/png;base64, ${img}"></img>
<h3>Версия: ${meta.Version}</h3>
<h3>Моды/Плагины: ${enlistMods(mods)}</h3>
<button value=${name}>Запустить</button>
</div>`;

function showCurrent() {

}

async function showAvailable() {
    let list = await axios.get(server + `api/serverList`);
    for(let i = 0; i < list.data.length; i++) {
        let image = await axios.get(server + `api/serverIcon/${list.data[i].Name}`);
        console.log(image);
        canvas.innerHTML += availableTemplate(i, list.data[i].Name, list.data[i].Meta, image.data);
    }
}

function show(param) {
    canvas.innerHTML = '';
    switch (param) {
        case "current":
            break;
        case "packages":
            canvas.innerHTML = "<h1 style='text-align:center;'>Сборки</h1>";
            showAvailable();
            break;
    }
}
