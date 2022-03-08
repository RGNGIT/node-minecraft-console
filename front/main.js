window.getCookie = (name) => {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        return match[2];
    }
}

const server = "http://localhost:25566/";
const canvas = document.querySelector(`#main-canvas`);

function enlistMods(mods) {
    let list = '<ul>';
    for (let mod of mods) {
        list += `<li>${mod}</li>`;
    }
    return `${list}</ul>`;
}

const availableTemplate = (id, name, meta, img, mods) => `<div>
${
    id == 0 ? '' : '<hr color="black" noshade>'
}
<h2 class='a-server-name'>${name}</h2>
<img class="a-server-img" src="data:image/png;base64, ${img}"></img>
<h3>Версия: ${
    meta.Version
}</h3>
<h3>Моды/Плагины: ${
    mods != null ? enlistMods(mods) : 'Отсутствуют (Ванилла)'
}</h3>
<button value=${name} onclick='startServer(value)'>Запустить</button>
</div>`;

const currentTemplate = (version, players, motd, icon) => `<div>
<h2 style='text-align:center;'>${
    motd.html
}</h2>
<img style='display: block;
margin-left: auto;
margin-right: auto;' src="${icon}"></img>
<h3 style='text-align:center;'>Версия</h3>
<p style='text-align:center;'>${
    version.name
} (Протокол: ${
    version.protocol
})</p>
<h3 style='text-align:center;'>Игроки</h3>
<p style='text-align:center;'>${
    players.online
}/${
    players.max
}</p>
<h3 style='text-align:center;'>Терминал</h3>
<p><textarea class='text-areas' id='console' placeholder='' readonly></textarea></p>
<input id='command' type='text' style='width: 100%; transform: translateX(-3px);'></input>
</div>`;

async function getLog() {
    return await axios.get(server + 'api/log');
}

async function showCurrent() {
    let current = await axios.get(server + 'api/status');
    console.log(current);
    if (current.data.code == 'ECONNREFUSED') {
        canvas.innerHTML += "<h2 style='text-align:center;'>Чет не течет...</h2>";
    } else {
        canvas.innerHTML += currentTemplate(current.data.version, current.data.players, current.data.motd, current.data.favicon);
        await setCommandLine();
        updater = setInterval(writeLog, 1000);
    }
}

async function showAvailable() {
    let list = await axios.get(server + `api/serverList`);
    for (let i = 0; i < list.data.length; i++) {
        let image = await axios.get(server + `api/serverIcon/${
            list.data[i].Name
        }`);
        console.log(image);
        canvas.innerHTML += availableTemplate(i, list.data[i].Name, list.data[i].Meta, image.data, list.data[i].Mods);
    }
}

async function setServer(dir) {
    let select = await axios.patch(`api/setServer?Name=${dir}`);
}

async function logger(element = document.querySelector("#log")) {
    let log = await getLog();
    element.innerHTML = '';
    for (let item of log.data.Log) {
        element.innerHTML += `<p>${item}</p>`
    }
    element.innerHTML += `<button onclick='refreshPage()'>На главную</button>`;
    element.innerHTML += `<button onclick='logger()'>Принудительно обновить</button>`;
    window.location.href = '#bottom';
}

let updater;

async function startServer(dir) {
    canvas.innerHTML = "<h2 style='text-align:center;'>Стартуем JVM...</h2>";
    await setServer(dir);
    let starter = await axios.get(server + 'api/start');
    canvas.innerHTML = "<h2 style='text-align:center;'>Логируем...</h2><div id='log'></div>";
    updater = setInterval(logger, 1000);
}

async function writeLog() {
    document.querySelector("#console").value = '';
    let log = await getLog();
    for (let item of log.data.Log) {
        document.querySelector("#console").value += item;
    }
}

async function sendCommand(command) {
    await axios.get(server + `api/cmd/${command}`);
    document.querySelector('#command').value = '';
    await writeLog();
}

async function show(param) {
    clearInterval(updater);
    canvas.innerHTML = '';
    switch (param) {
        case "current": canvas.innerHTML = "<h1 style='text-align:center;'>Текущий сервер</h1>";
            await showCurrent();
            await writeLog();
            break;
        case "packages": canvas.innerHTML = "<h1 style='text-align:center;'>Сборки</h1>";
            await showAvailable();
            break;
    }
}

function refreshPage() {
    window.location.reload();
}

async function setCommandLine() {
    inputId = document.querySelector('#command');
    inputId.addEventListener('keyup', async function onEvent(e) {
        if (e.keyCode === 13) {
            await sendCommand(inputId.value);
        }
    });
}

show('current');
