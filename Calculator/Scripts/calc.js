let numbers = document.querySelectorAll('.number'),
    operations = document.querySelectorAll('.operation'),
    clearBtns = document.querySelectorAll('.clear_btn'),
    trigOpBtns = document.querySelectorAll('.trigOp'),
    memoryBtns = document.querySelectorAll('.MemoryBtns'),
    decimalBtn = document.getElementById('decimal'),
    plusmnBtn = document.getElementById('plusmn'),
    factBtn = document.getElementById('fact'),
    saveBtn = document.getElementById('save'),
    display = document.getElementById('display'),
    dispMem = document.getElementById('displayMem'),
    logs = document.getElementById('Logs'),
    CurrentNumber = 0,
    FlagNewNumber = false,
    PendingOp = '',
    logString = ''; // Контейнер для 1й сессии лога 

window.onload = function () {
    if (localStorage.getItem('Memory') !== null) {
        dispMem.value = localStorage.getItem('Memory');
    }
    if (localStorage.getItem('Logs') !== null) {
        logs.value = localStorage.getItem('Logs');
    }
}
for (let i = 0; i < numbers.length; i++) {    
    numbers[i].addEventListener('click', function (e) {
        numberPress(e.target.textContent);
    });
};
for (let i = 0; i < operations.length; i++) {
    operations[i].addEventListener('click', function (e) {
        operathion(e.target.textContent);
    });
};
for (let i = 0; i < clearBtns.length; i++) {
    clearBtns[i].addEventListener('click', function (e) {
        clear(e.target.textContent);
    });
};
for (let i = 0; i < trigOpBtns.length; i++) {
    trigOpBtns[i].addEventListener('click', function (e) {
        trigonometry(e.target.textContent);
    });
};
for (let i = 0; i < memoryBtns.length; i++) {
    memoryBtns[i].addEventListener('click', function (e) {
        memory(e.target.textContent);
    });
};
decimalBtn.addEventListener('click', function (e) {
    decimal()
})
plusmnBtn.addEventListener('click', function (e) {
    plusmn()
})
factBtn.addEventListener('click', function (e) {
    factorial()
})
saveBtn.addEventListener('click', function (e) {
    saveFile(logs.value, 'logs', 'txt')
})
function numberPress(number) {  //нажатие кнопки с номером  
    if (display.value.length < 34) {
        if (FlagNewNumber) {
            display.value = number;
            FlagNewNumber = false;
        } else {
            if (display.value === '0') {
                display.value = number;
            } else {
                display.value += number;
            }
        }
    }
    else {
        alert("Максимальное количество символов!")
    }
};
function operathion(op) { //нажатие операции
    let localNum = display.value;
    if (FlagNewNumber) {
        display.value = CurrentNumber;
    } else {
        FlagNewNumber = true;
        switch (PendingOp) {
            case '+':
                CurrentNumber += parseFloat(localNum);
                break;
            case '-':
                CurrentNumber -= parseFloat(localNum);
                break;
            case '/':
                CurrentNumber /= parseFloat(localNum);
                break;
            case '*':
                CurrentNumber *= parseFloat(localNum);
                break;
            case 'y':
            case 'xy':
                let val = CurrentNumber;
                for (let i = 1; i < parseFloat(localNum); i++) {

                    val *= CurrentNumber;
                }
                CurrentNumber = val;
                break;
            case 'y√x':
                CurrentNumber = Math.pow(parseFloat(CurrentNumber), 1 / parseFloat(localNum))
                break;
            default:
                CurrentNumber = parseFloat(localNum);
                break;
        }

    }
    display.value = CurrentNumber;
    PendingOp = op;
    if (logString[logString.length - 1] !== ')' && logString[logString.length - 1] !== '!') {
        logString += localNum;
    }
    switch (PendingOp) {
        case '+':
        case '-':
        case '*':
        case '/':
            logString += PendingOp;
            break;
        case 'y':
        case 'xy':
            logString += '^';
            break;
        case 'y√x':
            logString += '√';
            break;
    }
    if (op === '=') {
        logs.value += display.value + ' = ' + logString + '\n';
        localStorage.setItem('Logs', logs.value);
        logString = '';
    }
};
function trigonometry(op) {
    switch (op) {
        case 'sin':
            logString += 'sin(' + display.value + ')';
            display.value = Math.sin(Math.PI / 180 * parseFloat(display.value))
            break;
        case 'cos':
            logString += 'cos(' + display.value + ')';
            display.value = Math.cos(Math.PI / 180 * parseFloat(display.value))
            break;
        case 'tan':
            logString += 'tan(' + display.value + ')';
            display.value = Math.tan(Math.PI / 180 * parseFloat(display.value))
            break;
    }
};
function memory(MemOp) {
    switch (MemOp) {
        case 'MS':
            dispMem.value = display.value;
            localStorage.setItem('Memory', dispMem.value);
            break;
        case 'MR':
            display.value = dispMem.value;
            break;
        case 'MC':
            dispMem.value = '0';
            localStorage.removeItem('Memory');
            break;
    }
};
function decimal() {
    let localDecimal = display.value;

    if (FlagNewNumber) {
        localDecimal = '0.';
        FlagNewNumber = false;
    } else {
        if (localDecimal.indexOf('.') === -1) {
            localDecimal += '.';
        }
    };
    display.value = localDecimal;
};
function plusmn() {
    let localSignt = display.value;
    if (!FlagNewNumber) {
        if (localSignt.indexOf('-') === -1) {
            localSignt = '-' + localSignt;
        } else {
            localSignt = localSignt.slice(1);
        }
    }
    display.value = localSignt;
};
function factorial() {
    logString += display.value + '!';
    let val = 1;
    for (let i = 2; i <= display.value; i++)
        val = val * i;
    display.value = val;
};
function clear(id) {
    switch (id) {
        case 'C':
            display.value = '0';
            FlagNewNumber = true;
            CurrentNumber = 0;
            PendingOp = '';
            logString = '';
            break;
        case 'CE':
            display.value = '0';
            FlagNewNumber = true;
            break;
        case 'Clear':
            logs.value = '';
            localStorage.removeItem('Logs');
            break;

    }
};
function saveFile(data, filename, type) {
    if (logs.value !== '') {
        let file = new Blob([data], { type: type });
        if (window.navigator.msSaveOrOpenBlob)
            window.navigator.msSaveOrOpenBlob(file, filename);
        else {
            let a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    } else {
        alert('Лог пуст!');
    }
};