export const GetRandomNumber = (Difficulty) => {
    const randomNumber = Math.floor(Math.random() * 9) + 1;
    const sign = Math.random() < 0.5 ? 1 : -1;
    return randomNumber * sign;
}

export const GetRandomOperation = (Difficulty) => {
    const operators = ["+", "-", "*", "/"]
    const operand1 = GetRandomNumber();
    let operand2 = GetRandomNumber();
    const operator = operators[Math.floor(Math.random() * 3)]
    let result = operand1
    switch (operator) {
        case "+":
            result = operand1 + operand2;
            break;
        case "-":
            result = operand1 - operand2;
            break;
        case "*":
            result = operand1 * operand2;
            break;
        case "/":
            if (operand2 === 0) {
                result = operand1;
                operand2 = 1;
            } else {
                result = operand1 / operand2;
            }
            break;
    }
    return {
        operand1,
        operand2,
        operator,
        result
    };
}