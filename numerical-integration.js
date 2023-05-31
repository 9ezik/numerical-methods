function calculateIntegral() {
    var funcInput = document.getElementById("function");
    var lowerLimitInput = document.getElementById("lower-limit");
    var upperLimitInput = document.getElementById("upper-limit");
    var numSegmentsInput = document.getElementById("num-segments");
    var resultOutput = document.getElementById("result");

    var func = funcInput.value;
    var lowerLimit = parseFloat(lowerLimitInput.value);
    var upperLimit = parseFloat(upperLimitInput.value);
    var numSegments = parseInt(numSegmentsInput.value);

    var deltaX = (upperLimit - lowerLimit) / numSegments;

    // метод прямокутників
    var rectangleSum = 0;
    for (var i = 0; i < numSegments; i++) {
        var x = lowerLimit + (i + 0.5) * deltaX;
        var y = calculateFunctionValue(func, x);
        rectangleSum += y;
    }
    var rectangleResult = rectangleSum * deltaX;

    // Метод трапецій 
    var trapezoidSum = 0;
    for (var i = 0; i < numSegments; i++) {
        var x1 = lowerLimit + i * deltaX;
        var x2 = lowerLimit + (i + 1) * deltaX;
        var y1 = calculateFunctionValue(func, x1);
        var y2 = calculateFunctionValue(func, x2);
        trapezoidSum += 0.5 * (y1 + y2);
    }
    var trapezoidResult = trapezoidSum * deltaX;

    // Метод Сімпсона
    var simpsonSum = 0;
    for (var i = 0; i < numSegments; i++) {
        var x1 = lowerLimit + i * deltaX;
        var x2 = lowerLimit + (i + 0.5) * deltaX;
        var x3 = lowerLimit + (i + 1) * deltaX;
        var y1 = calculateFunctionValue(func, x1);
        var y2 = calculateFunctionValue(func, x2);
        var y3 = calculateFunctionValue(func, x3);
        simpsonSum += (y1 + 4 * y2 + y3);
    }
    var simpsonResult = (deltaX / 6) * simpsonSum;

    

    resultOutput.innerHTML = "Метод прямокутників: " + rectangleResult.toFixed(6) + "<br>" +
                             "Метод трапецій: " + trapezoidResult.toFixed(6) + "<br>" +
                             "Метод Сімпсона: " + simpsonResult.toFixed(6);
}

function calculateFunctionValue(func, x) {
    return eval(func);
}

