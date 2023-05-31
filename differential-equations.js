function solveProblem() {
    var equationInput = document.getElementById("equation");
    var initialValueInput = document.getElementById("initial-value");
    var stepInput = document.getElementById("step");
    var rangeStartInput = document.getElementById("range-start");
    var rangeEndInput = document.getElementById("range-end");
    var resultOutput = document.getElementById("result");
    var plotDiv = document.getElementById("plot");
  
    var equation = equationInput.value;
    var initialValue = parseFloat(initialValueInput.value);
    var step = parseFloat(stepInput.value);
    var rangeStart = parseFloat(rangeStartInput.value);
    var rangeEnd = parseFloat(rangeEndInput.value);
  
    var eulerResult = solveWithEuler(equation, initialValue, step, rangeStart, rangeEnd);
  
    var rungeKuttaResult = solveWithRungeKutta(equation, initialValue, step, rangeStart, rangeEnd);
  
    var table = document.createElement("table");
    var headerRow = document.createElement("tr");
  
    var eulerHeader = document.createElement("th");
    eulerHeader.textContent = "Метод Эйлера";
    headerRow.appendChild(eulerHeader);
  
    var spacerCell = document.createElement("th");
    spacerCell.textContent = "";
    headerRow.appendChild(spacerCell);
  
    var rungeKuttaHeader = document.createElement("th");
    rungeKuttaHeader.textContent = "Метод Рунге-Кутта";
    headerRow.appendChild(rungeKuttaHeader);
  
    table.appendChild(headerRow);
  
    var numRows = Math.max(eulerResult.length, rungeKuttaResult.length);
  
    for (var i = 0; i < numRows; i++) {
      var row = document.createElement("tr");
  
      var eulerCell = document.createElement("td");
      if (i < eulerResult.length) {
        eulerCell.textContent = "x = " + eulerResult[i].x.toFixed(2) + ", y = " + eulerResult[i].y.toFixed(3);
      }
      row.appendChild(eulerCell);
  
      var spacerCell = document.createElement("td");
      spacerCell.textContent = "";
      row.appendChild(spacerCell);
  
      var rungeKuttaCell = document.createElement("td");
      if (i < rungeKuttaResult.length) {
        rungeKuttaCell.textContent = "x = " + rungeKuttaResult[i].x.toFixed(2) + ", y = " + rungeKuttaResult[i].y.toFixed(3);
      }
      row.appendChild(rungeKuttaCell);
  
      table.appendChild(row);
    }
  
    resultOutput.innerHTML = "";
    resultOutput.appendChild(table);
  
    var eulerTrace = {
      x: eulerResult.map(function (point) {
        return point.x;
      }),
      y: eulerResult.map(function (point) {
        return point.y;
      }),
      name: "Метод Ейлера",
      type: "scatter"
    };
  
    var rungeKuttaTrace = {
      x: rungeKuttaResult.map(function (point) {
        return point.x;
      }),
      y: rungeKuttaResult.map(function (point) {
        return point.y;
      }),
      name: "Метод Рунге-Кутта",
      type: "scatter"
    };
  
    var data = [eulerTrace, rungeKuttaTrace];
  
    var layout = {
      title: "Графік",
      xaxis: {
        title: "x"
      },
      yaxis: {
        title: "y"
      }
    };
  
    Plotly.newPlot(plotDiv, data, layout);
  }

function solveWithEuler(equation, initialValue, step, rangeStart, rangeEnd) {
    var result = [{ x: rangeStart, y: initialValue }];
    var x = rangeStart;
    var y = initialValue;

    while (x + step <= rangeEnd + step) {
        var slope = eval(equation, { x: x, y: y });
        y += step * slope;
        x += step;
        result.push({ x: x, y: y });
    }

    return result;
}

function solveWithRungeKutta(equation, initialValue, step, rangeStart, rangeEnd) {
    var result = [{ x: rangeStart, y: initialValue }];
    var x = rangeStart;
    var y = initialValue;

    while (x + step <= rangeEnd + step) {
        var k1 = step * eval(equation, { x: x, y: y });
        var k2 = step * eval(equation, { x: x + step / 2, y: y + k1 / 2 });
        var k3 = step * eval(equation, { x: x + step / 2, y: y + k2 / 2 });
        var k4 = step * eval(equation, { x: x + step, y: y + k3 });

        y += (k1 + 2 * k2 + 2 * k3 + k4) / 6;
        x += step;
        result.push({ x: x, y: y });
    }

    return result;
}

function formatSolution(solution) {
    var formattedSolution = "";
    for (var i = 0; i < solution.length; i++) {
        formattedSolution += "x = " + solution[i].x.toFixed(2) + ", y = " + solution[i].y.toFixed(6) + "<br>";
    }
    return formattedSolution;
}

function eval(expression, variables) {
    var code = "with (Math) { var x = variables.x, y = variables.y; return " + expression + "; }";
    var compiled = new Function("Math", "variables", code);
    return compiled(Math, variables);
}