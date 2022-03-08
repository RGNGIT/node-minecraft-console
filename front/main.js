window.getCookie = (name) => {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) 
        return match[2];
}

const server = "http://localhost:25566/";
const canvas = document.querySelector(`#main-canvas`);

function enlistMods(mods) {
    let list = '<ul>';
    for(let mod of mods) {
        list += `<li>${mod}</li>`;
    }
    return `${list}</ul>`;
}

const availableTemplate = (id, name, meta, img, mods) => 
`<div>
${id == 0 ? '' : '<hr color="black" noshade>'}
<h2 class='a-server-name'>${name}</h2>
<img class="a-server-img" src="data:image/png;base64, ${img}"></img>
<h3>Версия: ${meta.Version}</h3>
<h3>Моды/Плагины: ${mods != null ? enlistMods(mods) : 'Отсутствуют (Ванилла)'}</h3>
<button value=${name} onclick='startServer(value)'>Запустить</button>
</div>`;

const currentTemplate = (version, players, motd, icon) => 
`<div>
<h2 style='text-align:center;'>${motd.html}</h2>
<img style='display: block;
margin-left: auto;
margin-right: auto;' src="${icon}"></img>
<h3 style='text-align:center;'>Версия:</h3>
<p style='text-align:center;'>${version.name} (Протокол: ${version.protocol})</p>
<h3 style='text-align:center;'>Игроки:</h3>
<p style='text-align:center;'>${players.online}/${players.max}</p>
</div>`;

async function showCurrent() {
    let current = await axios.get(server + 'api/status');
    console.log(current);
    canvas.innerHTML += currentTemplate(current.data.version, current.data.players, current.data.motd, current.data.favicon);
}

async function showAvailable() {
    let list = await axios.get(server + `api/serverList`);
    for(let i = 0; i < list.data.length; i++) {
        let image = await axios.get(server + `api/serverIcon/${list.data[i].Name}`);
        console.log(image);
        canvas.innerHTML += availableTemplate(i, list.data[i].Name, list.data[i].Meta, image.data, list.data[i].Mods);
    }
}

async function setServer(dir) {
    let select = await axios.patch(`api/setServer?Name=${dir}`);
}

async function logger(element) {
    let log = await axios.get(server + 'api/log');
    element.innerHTML = '';
    for(let item of log.data.Log) {
        element.innerHTML += `<p>${item}</p>`
    }
    element.innerHTML += `<button onclick='refreshPage()'>На главную</button>`;
    window.location.href = '#bottom';
}

async function startServer(dir) {
    canvas.innerHTML = "<h2 style='text-align:center;'>Стартуем JVM...</h2>";
    await setServer(dir);
    let starter = await axios.get(server + 'api/start');
    canvas.innerHTML = "<h2 style='text-align:center;'>Логируем...</h2><div id='log'></div>";
    while(true) {
        await logger(document.querySelector("#log"));
    }
}

function show(param) {
    canvas.innerHTML = '';
    switch (param) {
        case "current":
            canvas.innerHTML = "<h1 style='text-align:center;'>Текущий сервер</h1>";
            showCurrent();
            break;
        case "packages":
            canvas.innerHTML = "<h1 style='text-align:center;'>Сборки</h1>";
            showAvailable();
            break;
    }
}

function refreshPage(){
    window.location.reload();
} 

show('current');