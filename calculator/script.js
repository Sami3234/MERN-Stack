let result = document.getElementById('result');

function appendToDisplay(value) {
    result.value += value;
}

function clearDisplay() {
    result.value = '';
}

function deleteLastChar() {
    result.value = result.value.slice(0, -1);
}

function calculate() {
    try {
        let expression = result.value;
        // Replace × with * for calculation
        expression = expression.replace(/×/g, '*');
        // Handle percentage
        expression = expression.replace(/(\d+)%/g, (match, p1) => p1 / 100);
        result.value = eval(expression);
    } catch (error) {
        result.value = 'Error';
    }
}

// Add keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (/[0-9]/.test(key) || ['+', '-', '*', '/', '.', '%'].includes(key)) {
        appendToDisplay(key);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        deleteLastChar();
    } else if (key === 'Escape') {
        clearDisplay();
    }
}); 