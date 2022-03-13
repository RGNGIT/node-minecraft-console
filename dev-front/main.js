window.getCookie = (name) => {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        return match[2];
    }
}

const server = "http://localhost:25566/";
//const server = "http://mc.19ivt.ru/";
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
<h2 class='a-server-name'>${name} (${
    meta.MD5
})</h2>
<img class="a-server-img" src="data:image/png;base64, ${img}"></img>
<h3>Версия: ${
    meta.Version
}</h3>
<h3>Моды/Плагины: ${
    mods != null ? enlistMods(mods) : 'Отсутствуют (Ванилла)'
}</h3>
<button value=${name} onclick='startServer(value)'>Запустить</button>
<button value=${name} onclick='deleteServer(value)' disabled>Удалить</button>
<input type='file' id='${name}-modify'></input>
<button value=${name} onclick='addModifications(value, "plugin")'>Добавить пак модификаций</button>
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

const uploadTemplate = () => `<dir>
<input type='text' id='server-name' placeholder='Имя сервера'></input>
<input type='text' id='server-version' placeholder='Версия сервера'></input>
<input type='file' id='sfile'></input>
<input type='file' id='spic'></input>
<input type='file' id='smodify'></input>
<button onclick='uploadServer()'>Выгрузить сборку</button>
</dir>
<hr color="black" noshade>`;

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

async function addModifications(dir, mode) {
    let fd = new FormData();
    let smodify = document.querySelector(`#${dir}-modify`);
    fd.append('package', smodify.files[0]);
    let res = await axios.post(server + `api/uploadModifications/${dir}?type=${mode}`, fd);
    res.data == 'OK' ? show('packages') : console.log("Error");
}

async function deleteServer(dir) {
    let res = await axios.delete(server + `api/delete/${dir}`);
    console.log(res.data);
    res.data == 'OK' ? show('packages') : console.log("Error");
}

async function uploadModifications(dir, mode) {
    let fd = new FormData();
    let smodify = document.querySelector("#smodify");
    fd.append('package', smodify.files[0]);
    if(smodify.files[0] != null) {
    await axios.post(server + `api/uploadModifications/${dir}?type=${mode}`, fd);
    }
}

async function showAvailable() {
    let list = await axios.get(server + `api/serverList`);
    canvas.innerHTML += uploadTemplate();
    if (list.data.length == 0) {
        canvas.innerHTML += "<h2 style='text-align:center;'>Нет доступных сборок</h2>";
    }
    for (let i = 0; i < list.data.length; i++) {
        let image = await axios.get(server + `api/serverIcon/${
            list.data[i].Name
        }`);
        console.log(image);
        canvas.innerHTML += availableTemplate(i, list.data[i].Name, list.data[i].Meta, image.data, list.data[i].Mods);
    }
}

async function uploadServer() {
    let fd = new FormData();
    let sfile = document.querySelector("#sfile");
    let pfile = document.querySelector("#spic");
    let name = document.querySelector("#server-name").value;
    let ver = document.querySelector("#server-version").value;
    fd.append("server", sfile.files[0]);
    fd.append("icon", pfile.files[0]);
    let res = await axios.post(server + `api/uploadServer/${name}?ver=${ver}&eula=true`, fd, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    await uploadModifications(name, 'plugin');
    res.data == 'OK' ? show('packages') : console.log("Error");
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
