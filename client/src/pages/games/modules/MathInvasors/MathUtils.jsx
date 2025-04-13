export const GetRandomNumber = (Difficulty) => {
    const randomNumber = Math.floor(Math.random() * 9) + 1;
    const sign = Math.random() < 0.5 ? 1 : -1;
    return randomNumber * sign;
}

export const GetRandomOperation = (Difficulty) => {
    const operators = ["+", "-", "*", "/"]
    let operand1 = GetRandomNumber();
    let operand2;
    const operator = operators[Math.floor(Math.random() * 4)]
    if (operator !== "/") operand2 = GetRandomNumber();
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
            const absOperand1 = Math.abs(operand1);
            const divisors = [];
            for (let i = 1; i <= absOperand1; i++) {
                if (absOperand1 % i === 0) {
                    divisors.push(i);
                    divisors.push(-i);
                }
            }
            operand2 = divisors[Math.floor(Math.random() * divisors.length)];
            if (operand2 === 0) {
                operand2 = 1;
            }
            result = operand1 / operand2;
            break;
    }
    return {
        operand1,
        operand2,
        operator,
        result
    };
}