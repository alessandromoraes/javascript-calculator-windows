class CalculatorController {
    constructor() {
        this._locale = 'pt-BR';
        this._displayCalculatorElement = document.querySelector('#display');
        this._displayDateElement = document.querySelector('#datetime .date');
        this._displayTimeElement = document.querySelector('#datetime .time');
        this._operation = [];
        this._lastOperator = '';
        this._lastNumber = '';
        this.initialize();
        this.initButtonsEvents();
    }

    initialize() {
        this.setLastNumberToDisplay();
        this.setDisplayDateTime();
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);
    }

    get displayCalculatorElement() {
        return this._displayCalculatorElement.innerHTML;
    }

    set displayCalculatorElement(value) {
        this._displayCalculatorElement.innerHTML = value;
    }

    get displayTime() {
        return this._displayTimeElement.innerHTML;
    }

    set displayTime(value) {
        this._displayTimeElement.innerHTML = value;
    }

    get displayDate() {
        return this._displayDateElement.innerHTML;
    }

    set displayDate(value) {
        this._displayDateElement.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    initButtonsEvents() {
        let buttons = document.querySelectorAll(".container .btn");

        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, "click drag", e => {
                let textContentBtn = btn.textContent;
                this.execteBtn(textContentBtn);
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            });
        });
    }

    addEventListenerAll(element, events, fn) {
        events.split(" ").forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    execteBtn(value) {
        switch (value) {
            case 'C':
                this.clearAll();
                break;

            case 'CE':
                this.clearEntry();
                break;

            case '+':
                this.addOperation('+');
                break;

            case '-':
                this.addOperation('-');
                break;

            case 'X':
                this.addOperation('*');
                break;

            case '÷':
                this.addOperation('/');
                break;

            case '%':
                this.addOperation('%');
                break;

            case ',':
                this.addDot();
                break;

            case '=':
                this.calc();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }
    }

    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    addOperation(value) {
        if (isNaN(this.getLastOperation())) {
            if (this.isOperator(value)) {
                this.setLastOperation(value);
            } else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        } else {
            if (this.isOperator(value)) {
                this.pushOperation(value);
            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                this.setLastNumberToDisplay();
            }
        }
    }

    setError() {
        this.displayCalculatorElement = "ERROR";
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value) {
        var operators = ['+', '-', '*', '/', '%'].indexOf(value);
        var result = (operators > -1) ? true : false;
        return result;
    }

    pushOperation(value) {
        this._operation.push(value);
        if (this._operation.length > 3) {
            this.calc();
        }
    }

    calc() {
        let lastOperator = '';
        this._lastOperator = this.getLastItem();
        if(this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }
        if(this._operation.length > 3) {
            lastOperator = this._operation.pop();
            this._lastNumber = this.getResult();
        } else if(this._operation.length == 3) {
            this._lastNumber = this.getLastItem(false);
        }
        let result = this.getResult();
        if (lastOperator == '%') {
            result /= 100;
            this._operation = [result];
        } else {
            this._operation = [result];
            if(lastOperator) this._operation.push(lastOperator);
        }
        this.setLastNumberToDisplay(this._lastOperator);
    }

    getLastItem(isOperator = true) {
        let lastItem;
        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }
        if(!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    }

    setLastNumberToDisplay() {
        let lastNumber = this.getLastItem(false);
        if (!lastNumber) lastNumber = 0;
        this.displayCalculatorElement = lastNumber;
    }

    getResult() {
        return eval(this._operation.join(''));
    }

    addDot() {
        let lastOperation = this.getLastOperation();
        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;
        if(this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.')
        }
        this.setLastNumberToDisplay();
        console.log(lastOperation);
    }
}
