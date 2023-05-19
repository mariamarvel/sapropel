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

    sendMail(event);
}

function formReset() {
    form.reset();
    validFormArr.forEach((el) => {
        el.setAttribute("is-valid", 0);
        el.style.border = "none";
    });
}

function sendMail(event) {
    event.preventDefault();
    let name = inputArr[0].value;
    let email = inputArr[1].value;
    let phone = inputArr[2].value;
    let msg = inputArr[3].value;
    let ebody = `
    <b>Имя: </b>${name}
    <br>
    <b>Email: </b>${email}
    <br>
    <b>Телефон: </b>${phone}
    <br>
    <b>Сообщение: </b>${msg}
    `;
    console.log(inputArr[3].value);
    Email.send({
        SecureToken: "e3050873-0b75-43da-8af1-ab2e7be24f31", //add your token here
        To: 'maaborodulina@gmail.com',
        From: email,
        Subject: "Запрос из формы обратной связи",
        Body: ebody
    }).then(message => {
        if (message == "OK") {
            alert("Ваше сообщение успешно отправлено!");
            formReset(); //сброс формы
        } else {
            alert("Ошибка: " + message);
        }


    });
}


