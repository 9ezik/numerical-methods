function lagrangeInterpolation() {
    const xi = [];
    const fi = [];

    // Отримуємо значення вузлів і функцій з форми
    for (let i = 0; i < 5; i++) {
      xi.push(parseFloat(document.getElementById(`x${i}`).value));
      fi.push(parseFloat(document.getElementById(`f${i}`).value));
    }

    const xValues = [];
    const interpolatedValues = [];
    const linearApproximationValues = [];
    const quadraticApproximationValues = [];

    for (let i = xi[0]-1; i <= xi[4]+1; i++) {
        xValues.push(i);
        interpolatedValues.push(lagrangeInterpolationSingle(i, xi, fi));
    }

    // Обчислюємо значення апроксимаційних поліномів
    const linearCoefficients = calculateLinearApproximation(xi, fi);
    const quadraticCoefficients = calculateQuadraticApproximation(xi, fi);

    console.log("quadraticCoefficients");
    console.log(quadraticCoefficients);

    for (let i = xi[0]-1; i <= xi[4]+1; i++) {
      linearApproximationValues.push(evaluateLinearApproximation(i, linearCoefficients));
      quadraticApproximationValues.push(evaluateQuadraticApproximation(i, quadraticCoefficients));
    }

    // Виводимо результати на сторінку
    const resultTable = document.getElementById("resultTable");
    resultTable.innerHTML = "<tr><th>x</th><th>Інтерполяція</th><th>Апроксимація (Лінійна)</th><th>Апроксимація (Квадратична)</th></tr>";
    for (let i = 0; i < xValues.length; i++) {
      const row = document.createElement("tr");
      const xCell = document.createElement("td");
      const interpolatedCell = document.createElement("td");
      const linearApproximationCell = document.createElement("td");
      const quadraticApproximationCell = document.createElement("td");

      xCell.textContent = xValues[i];
      interpolatedCell.textContent = interpolatedValues[i].toFixed(3);
      linearApproximationCell.textContent = linearApproximationValues[i].toFixed(3);
      quadraticApproximationCell.textContent = quadraticApproximationValues[i].toFixed(3);

      row.appendChild(xCell);
      row.appendChild(interpolatedCell);
      row.appendChild(linearApproximationCell);
      row.appendChild(quadraticApproximationCell);
      resultTable.appendChild(row);
    }

    const ctx = document.getElementById('chart').getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: xValues,
          datasets: [
            {
              label: 'Інтерполяція (Лагранж)',
              data: interpolatedValues,
              borderColor: 'blue',
              fill: false,
            },
            {
              label: 'Апроксимація (Лінійна)',
              data: linearApproximationValues,
              borderColor: 'red',
              fill: false,
            },
            {
              label: 'Апроксимація (Квадратична)',
              data: quadraticApproximationValues,
              borderColor: 'green',
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'x',
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'f(x)',
              },
            },
          },
        },
      });
  }

  // Функція для обчислення інтерполяційного поліному Лагранжа для одного значення x
  function lagrangeInterpolationSingle(x, xi, fi) {
    let n = xi.length;
    let result = 0;

  for (let i = 0; i < n; i++) {
    let term = fi[i];

    for (let j = 0; j < n; j++) {
      if (j !== i) {
        term *= (x - xi[j]) / (xi[i] - xi[j]);
      }
    }

    result += term;
  }

  return result;
}

// Функція для обчислення апроксимаційного поліному першого ступеня (лінійного)
function calculateLinearApproximation(xi, fi) {
  const n = xi.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += xi[i];
    sumY += fi[i];
    sumXY += xi[i] * fi[i];
    sumX2 += xi[i] * xi[i];
  }

  const denominator = n * sumX2 - sumX * sumX;
  const a = (n * sumXY - sumX * sumY) / denominator;
  const b = (sumX2 * sumY - sumX * sumXY) / denominator;
  return [a, b];
}

// Функція для обчислення значення апроксимаційного поліному першого ступеня (лінійного) для заданого x
function evaluateLinearApproximation(x, coefficients) {
  const [a, b] = coefficients;
  return a * x + b;
}

// Функція для обчислення апроксимаційного поліному другого ступеня (квадратичного)
function calculateQuadraticApproximation(xi, fi) {
  const n = xi.length;
  let sumX = 0;
  let sumX2 = 0;
  let sumX3 = 0;
  let sumX4 = 0;
  let sumF = 0;
  let sumFX = 0;
  let sumFX2 = 0;

  for (let i = 0; i < n; i++) {
    const x = xi[i];
    const f = fi[i];
    sumX += x;
    sumX2 += x * x;
    sumX3 += x * x * x;
    sumX4 += x * x * x * x;
    sumF += f;
    sumFX += f * x;
    sumFX2 += f * x * x;
  }
  
  const matrix = [
    [sumX2, sumX, n],
    [sumX3, sumX2, sumX],
    [sumX4, sumX3, sumX2]
  ];
  
  const constants = [sumF, sumFX, sumFX2];
  
  const result = numeric.solve(matrix, constants);
  
  const a = result[0];
  const b = result[1];
  const c = result[2];
  
  console.log(`a = ${a}`);
  console.log(`b = ${b}`);
  console.log(`c = ${c}`);

  return [a, b, c];
}

function evaluateQuadraticApproximation(x, coefficients) {
    const [a, b, c] = coefficients;
    return a * x * x + b * x + c;
}
