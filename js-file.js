// basic math functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(operator, a, b) {
    switch(operator) {
        case '+':
            add(a, b);
            break;
        case '-':
            subtract(a, b);
            break;
        case '*':
            multiply(a, b);
        case '/':
            divide(a, b);
            break;
        default:
            print('wrong operator');
    }
}

const numButtons = document.querySelectorAll('button.num');
const display = document.getElementById('display');
let displayValue;

numButtons.forEach(button => {
    button.addEventListener('click', (e) => { 
        if(display.textContent == '0') display.textContent = '';
        display.textContent += e.target.textContent;
        displayValue = display.textContent;
    })    
})


