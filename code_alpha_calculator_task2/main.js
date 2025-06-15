 // Calculator state
 let currentExpression = '0';
 let lastResult = 0;
 let resetOnNextInput = false;
 
 // DOM elements
 const expressionElement = document.getElementById('expression');
 const resultElement = document.getElementById('result');
 const buttons = document.querySelectorAll('button');
 
 // Update display
 function updateDisplay() {
     expressionElement.textContent = currentExpression;
     
     // Evaluate expression in real-time
     try {
         if (currentExpression !== '') {
             // Replace symbols for evaluation
             const evalExpression = currentExpression
                 .replace(/×/g, '*')
                 .replace(/÷/g, '/')
                 .replace(/−/g, '-');
             
             // Evaluate safely
             const result = Function('"use strict"; return (' + evalExpression + ')')();
             lastResult = result;
             
             // Format result
             if (Number.isInteger(result)) {
                 resultElement.textContent = result;
             } else {
                 resultElement.textContent = result.toFixed(6).replace(/\.?0+$/, '');
             }
         } else {
             resultElement.textContent = '0';
         }
     } catch (error) {
         resultElement.textContent = '';
     }
 }
 
 // Handle button clicks
 function handleButtonClick(value) {
     if (resetOnNextInput && !'+-*/'.includes(value)) {
         currentExpression = '';
         resetOnNextInput = false;
     }
     
     if (value === 'clear') {
         // Clear everything
         currentExpression = '0';
         lastResult = 0;
         resetOnNextInput = false;
     } else if (value === 'backspace') {
         // Remove last character
         if (currentExpression.length === 1) {
             currentExpression = '0';
         } else {
             currentExpression = currentExpression.slice(0, -1);
         }
     } else if (value === '=') {
         // Evaluate expression
         if (currentExpression !== '0') {
             currentExpression = lastResult.toString();
             resetOnNextInput = true;
         }
     } else if ('+-*/'.includes(value)) {
         // Handle operators
         if (currentExpression === '0' && value === '-') {
             // Allow negative numbers
             currentExpression = value;
         } else {
             const lastChar = currentExpression.slice(-1);
             
             if ('+-*/'.includes(lastChar)) {
                 // Replace operator if last character is an operator
                 currentExpression = currentExpression.slice(0, -1) + value;
             } else {
                 currentExpression += value;
             }
         }
     } else if (value === '.') {
         // Handle decimal point
         const parts = currentExpression.split(/[\+\-\*\/]/);
         const lastPart = parts[parts.length - 1];
         
         if (!lastPart.includes('.')) {
             currentExpression += value;
         }
     } else {
         // Handle numbers
         if (currentExpression === '0' || resetOnNextInput) {
             currentExpression = value;
             resetOnNextInput = false;
         } else {
             currentExpression += value;
         }
     }
     
     // Limit expression length
     if (currentExpression.length > 30) {
         currentExpression = currentExpression.slice(0, 30);
     }
     
     updateDisplay();
 }
 
 // Add event listeners to buttons
 buttons.forEach(button => {
     button.addEventListener('click', () => {
         handleButtonClick(button.getAttribute('data-value'));
     });
 });
 
 // Keyboard support
 document.addEventListener('keydown', (e) => {
     const key = e.key;
     
     // Prevent default for keys we handle
     if (/[\d\.\+\-\*\/=]|Enter|Backspace|Escape/.test(key)) {
         e.preventDefault();
     }
     
     if (key === 'Enter' || key === '=') {
         handleButtonClick('=');
     } else if (key === 'Backspace') {
         handleButtonClick('backspace');
     } else if (key === 'Escape' || key === 'c' || key === 'C') {
         handleButtonClick('clear');
     } else if (key === '*') {
         handleButtonClick('*');
     } else if (key === '/') {
         handleButtonClick('/');
     } else if (key === '+') {
         handleButtonClick('+');
     } else if (key === '-') {
         handleButtonClick('-');
     } else if (key === '.') {
         handleButtonClick('.');
     } else if (/^\d$/.test(key)) {
         handleButtonClick(key);
     }
 });
 
 // Initialize display
 updateDisplay();