// GUI ELEMENTS (BUTTONS AND DISPLAY)
const numButtons = document.querySelectorAll('button.num');
const opButtons = document.querySelectorAll('button.op');
const decimalButton = document.querySelector('button#bdec');
const clearButton = document.querySelector('button#bC');
const deleteButton = document.querySelector('button#bdel');
const equalsButton = document.querySelector('button.equals');
const signButton = document.querySelector('button#bsign');
const display = document.getElementById('display');


// VARIABLES
let result = 0;
let current = 0;
let operator = '+';
let equalsClicked = false;
let operatorClicked = false;


// BASIC MATH FUNCTIONS
function add(a, b) {
    // if at least one number is a float to deal with imprecision
    if(!Number.isInteger(a) || ! Number.isInteger(b)) {
        let ba = base(a);
        let bb = base(b);
        let sel = ba > bb ? ba : bb;
        return (a * sel + b * sel) / sel;
    }
    // if both numbers are integers
    return +a + +b;
}

function subtract(a, b) {
    // if at least one number is a float to deal with imprecision
    if(!Number.isInteger(a) || ! Number.isInteger(b)) {
        let ba = base(a);
        let bb = base(b);
        let sel = ba > bb ? ba : bb;
        return (a * sel - b * sel) / sel;
    }
    // if both numbers are integers
    return a - b;
}

function multiply(a, b) {
    // if at least one number is a float to deal with imprecision
    if(!Number.isInteger(a) || ! Number.isInteger(b)) {
        let ba = base(a);
        let bb = base(b);
        return +((a * ba) * (b * bb) / (ba * bb)).toFixed(7);
    }
    // if both numbers are integers
    return a * b;
}

function divide(a, b) {
    // if at least one number is a float to deal with imprecision
    if(!Number.isInteger(a) || ! Number.isInteger(b)) {
        let ba = base(a);
        let bb = base(b);
        let sel = ba > bb ? ba : bb;
        return +((a * sel) / (b * sel)).toFixed(7);
    }
    // if both numbers are integers
    return +(a / b).toFixed(7);
}

// choose math operation and return result
function operate(operator, a, b) {
    let res;
    switch(operator) {
        case '+':
            res = add(a, b);
            break;
        case '-':
            res = subtract(a, b);
            break;
        case '*':
            res = multiply(a, b);
            break;
        case '/':
            res = divide(a, b);
            break;
        default:
            res = 0;
    }

    // make sure the result isn't too long to fit in display
    res = res.toString();
    if(res.length > 16) {
        res = res.slice(0, 16);
    }
    
    return +res;
}


// HANDLING GUI ELEMENTS
function handleDecimalPoint() {
    decimalButton.disabled = display.textContent.includes('.');
}

function handleDelete(enabled) {
    deleteButton.disabled = !enabled;
}

function handleSign(enabled) {
    signButton.disabled = !enabled;
}


// HANDLING BUTTON EVENTS
// numeric buttons (0-9 and decimal point)
numButtons.forEach(button => {
    button.addEventListener('click', (e) => {    
        // clicked after the equals sign was clicked?
        if(equalsClicked) {
            reset();
        }

        // was an operator just clicked?
        if(operatorClicked) {
            operatorClicked = false;
        }
        
        // enable delete button
        handleDelete(true);

        //enable sign button
        handleSign(true);

        // when typing the second number after an operator      
        if(current === 0 && display.textContent != '0.') {
            display.textContent = 0;
        }

        // max 8 digits
        if(checkDigitCount(8)) {
            // only one decimal point
            if(e.target.textContent == '.') {                
                if(!display.textContent.includes('.')) {
                    display.textContent += e.target.textContent;
                }
            }   
            // just add the character 
            else {
                // no leading zero
                if(display.textContent == '0') {
                    display.textContent = '';
                }
                display.textContent += e.target.textContent;
            }         
        }
        
        // is there a decimal point already?
        handleDecimalPoint();
        setCurrent();
    })    
})

// operator buttons (+, -, *, /)
opButtons.forEach(button => {
    button.addEventListener('click', (e) => {         
        // calculate result so far
        if(!operatorClicked) {
            result = operate(operator, result, current); 
        }
            
        // set current operator and value
        operator = e.target.textContent;               
        current = 0;    
        
        // display current result
        display.textContent = result; 
        operatorClicked = true;
        equalsClicked = false;            

        // disable DEL and +/- buttons
        handleDelete(false);
        handleSign(false);         
    })    
})

// sign button (+/-)
signButton.addEventListener('click', () => {
    display.textContent *= -1;
    setCurrent();
})

// clear button (AC)
clearButton.addEventListener('click', () => {            
    display.textContent = '0';
    handleDecimalPoint();
    setCurrent();
    reset();
})

// delete button (DEL)
deleteButton.addEventListener('click', () => {
    // don't delete everything and don't leave just the minus sign
    if(checkDigitCount(1, true) &&
        !display.textContent.endsWith('.')) {
        display.textContent = 0;
    }
    else {
        display.textContent = display.textContent.substring(0, 
            display.textContent.length - 1);
    }

    handleDecimalPoint();
    setCurrent();
})

// equals button (=)
equalsButton.addEventListener('click', () => {
    // nothing will change if you click multiple times,otherwise calculate
    if(!equalsClicked) {
        setCurrent();
        result = operate(operator, result, current);
        current = 0;
        display.textContent = result;
        operator = '+';
        equalsClicked = true;
    }
    handleDelete(false);
    handleSign(false);
})



// HELPER FUNCTIONS 
// get the number to multiply and divide floats by to handle imprecision
function base(floatNum) {    
    if(Number.isInteger(floatNum)) {
        return 1;
    }
    else {
        let decimalPlaces = floatNum.toString().split('.')[1].length;
        return 10 ** decimalPlaces;
    }       
}

// check if displayed number is as long as or longer than a value
function checkDigitCount(len, equal=false) {
    let abs = Math.abs(display.textContent);
    if(equal) {
        return abs.toString().length === len;
    }
    else {
        return abs.toString().length < len;
    }
}

// save the value that is being entered 
function setCurrent() {
    current = +display.textContent;
}

// reset result
function reset() {
    result = 0;
    operator = '+';
    equalsClicked = false;
}
