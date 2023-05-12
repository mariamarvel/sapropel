const form = document.forms["form"];
//обработчик для кнопки
const button = form.elements["button"];

const inputArr = Array.from(form); //массив всех инпутов
const validInputArr = []; //массив валидных инпутов, которые нужно проверить на валидность

inputArr.forEach((el) => {
    if (el.hasAttribute("data-reg")) {  //если элемент имеет атрибут "data-reg", то он проверяется на валидность и пушится в validInputArr
        el.setAttribute("is-valid", "0");
        validInputArr.push(el);
    }
});
console.log(validInputArr);

// обработчик событий из полей ввода
form.addEventListener("input", inputHandler);//обрабатываем для события input 
form.addEventListener("submit", formCheck);//обрабатываем для события click

function inputHandler({ target }) {
    if (target.hasAttribute("data-reg")) {
        inputCheck(target);
    }
}

//функция для проверки инпутов
function inputCheck(el) {
    const inputValue = el.value;
    const inputReg = el.getAttribute("data-reg");
    //преобразуем строку в регулярное выражение
    const reg = new RegExp(inputReg);
    console.log(inputValue, reg);
    //проверим поле на валидность
    if (reg.test(inputValue)) {
        el.style.border = "2px solid rgb(0, 196, 0)";
        el.setAttribute("is-valid", "1");//если проверка пройдена, задаю значение 1
    } else {
        el.style.border = "2px solid rgb(255, 0, 0)";
        el.setAttribute("is-valid", "0");//если проверка не пройдена, задаю значение 0
    }
}

//кнопка блокируется, если одно из полей заполненно неверно
function formCheck(event) {
    event.preventDefault();
    const isAllValid = []; //массив передаём 0 или 1, если все 1 , то форма отпр иначе нет
    validInputArr.forEach((el) => {
        isAllValid.push(el.getAttribute("is-valid"));//постепенно пушит в массив полученные значения атрибута is-valid
    });//выполняет функцию, для каждого из элементов
    // console.log(isAllValid);

    //проверка, если все поля 1, то итог будет 1 или нет
    const isValid = isAllValid.reduce((acc, current) => {
        return acc && current;
    });
    // console.log(isValid);
    console.log(Boolean(Number(isValid)));
    //(!Boolean(Number(isValid))) перевод сначала в число, а потом в булевое выражение
    if (!Boolean(Number(isValid))) {
        // event.preventDefault(); блокировка события
        alert("Заполните поля правильно");
        return;
    }
    formSubmit();
}

async function formSubmit() {
    console.log("Проверка пройдена, данные отправляются...");
    const data = serializeForm(form);
    const response = await sendData(data)//содержит ответ, при отправке сообщения, в функцию sendData(data)  посылаем наши данные

    //условия для получения ответа об отправке письма
    if (response.ok) {
        let result = await response.json();
        alert(result.message);
        formReset(); //сброс формы
    } else {
        alert("Код ошибки: " + response.status);
    }
}
function serializeForm(formNode) {
    return new FormData(formNode); //преобразование данных переданых по почте, в правильный вид
}
async function sendData(data) {
    return await fetch("send_mail.php", {
        method: "POST",
        body: data,
    }); //fetch() позволяет отправлять форму без перезагрузки, она отправляет запросы асинхронно. "send_mail.php"  куда отправляем данные{некоторые настройки}
}

//сброс всех полей формы, вместе с подсветкой полей
function formReset() {
    form.reset();
    validFormArr.forEach((el) => {
        el.setAttribute("is-valid", 0);
        el.style.border = "none";
    });
}