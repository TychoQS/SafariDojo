export const GetRandomNumber = (Magnitude) => {
    let BaseNumber = Math.pow(10, Magnitude);
    const RandomFactor = Math.floor(Math.random() * 9) + 1;
    const RandomOffset = Math.floor(Math.random() * 9) + 1;
    const Sign = Math.random() < 0.5 ? 1 : -1;
    const RandomNumber = (BaseNumber * RandomFactor) + RandomOffset;
    return RandomNumber * Sign;
}

function GetNumbersMagnitude(DifficultyLevel) {
    return  DifficultyLevel+1;
}

function GetOperatorRange(DifficultyLevel) {
    let range;
    switch(DifficultyLevel) {
        case 0:
            range = 2;
            break;
        case 1:
            range = 3;
            break;
        default:
            range = 4;
            break;
    }
    return range;
}

export const GetRandomOperation = (DifficultyLevel) => {
    let Magnitude = GetNumbersMagnitude(DifficultyLevel);
    let OperatorRange = GetOperatorRange(DifficultyLevel);
    const operators = ["+", "-", "*", "/"]
    let operand1 = GetRandomNumber(Magnitude);
    console.log(DifficultyLevel);
    console.log(OperatorRange);
    let operand2;
    const operator = operators[Math.floor(Math.random() * OperatorRange)]
    if (operator !== "/") operand2 = GetRandomNumber(Magnitude);
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