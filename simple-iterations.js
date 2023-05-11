function solve() {
  const A = [];
  const B = [];
  const initialX = [];
  
  for (let i = 1; i <= 4; i++) {
    const row = [];
    for (let j = 1; j <= 4; j++) {
      row.push(parseFloat(document.getElementById(`a${i}${j}`).value));
    }
    A.push(row);
    B.push(parseFloat(document.getElementById(`b${i}`).value));
    initialX.push(parseFloat(document.getElementById(`initial-x${i}`).value));
  }
  const tolerance = parseFloat(document.getElementById('tolerance').value);
  const result = simpleIteration(A, B, initialX, tolerance);
  
  const resultEl = document.getElementById('result');
  if (result) {
    resultEl.textContent = `x1 = ${result[0]}, x2 = ${result[1]}, x3 = ${result[2]}, x4 = ${result[3]}`;
  } else {
    resultEl.textContent = 'No result';
  }
}

function simpleIteration(A, B, initialX, tolerance) {
  const n = A.length;
  let x = [...initialX];
  let norm = Infinity;
  let iteration = 0;

  while (norm > tolerance) {
    let nextX = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      let s = 0;

      for (let j = 0; j < n; j++) {
        if (i !== j) {
          s += A[i][j] * x[j];
        }
      }

      nextX[i] = (B[i] - s) / A[i][i];
    }

    norm = 0;

    for (let i = 0; i < n; i++) {
      norm += Math.pow(nextX[i] - x[i], 2);
    }

    norm = Math.sqrt(norm);
    x = nextX;
    iteration++;
  }

  return iteration <= 1000 ? x : null;
}