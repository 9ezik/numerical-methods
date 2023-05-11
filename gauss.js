function solve() {
    const table = document.getElementById("matrix-input");
    const cells = table.getElementsByTagName("input");
    
    const matrix = [[], [], []];
    const vector = [];
    let index = 0;
    
    for (let i = 0; i < cells.length; i++) {
      if (i % 4 !== 3) {
        matrix[index].push(parseFloat(cells[i].value));
      } else {
        vector.push(parseFloat(cells[i].value));
        index++;
      }
    }
    
    // вирішуємо систему методом Гауса
    for (let i = 0; i < 3; i++) {
      // знаходимо максимальний елемент у стовпці
      let maxElement = Math.abs(matrix[i][i]);
      let maxRow = i;
      
      for (let j = i + 1; j < 3; j++) {
        if (Math.abs(matrix[j][i]) > maxElement) {
          maxElement = Math.abs(matrix[j][i]);
          maxRow = j;
        }
      }
      
      // міняємо строки местами
      for (let k = i; k < 4; k++) {
        const tmp = matrix[maxRow][k];
        matrix[maxRow][k] = matrix[i][k];
        matrix[i][k] = tmp;
      }
      const tmp = vector[maxRow];
      vector[maxRow] = vector[i];
      vector[i] = tmp;
      
      // наводимо матрицю до трикутного вигляду
      for (let j = i + 1; j < 3; j++) {
        const c = -matrix[j][i] / matrix[i][i];
        for (let k = i; k < 4; k++) {
          if (i == k) {
            matrix[j][k] = 0;
          } else {
            matrix[j][k] += c * matrix[i][k];
          }
        }
        vector[j] += c * vector[i];
      }
    }
    
    // зворотний хід методу Гауса
    const solution = [0, 0, 0];
    for (let i = 2; i >= 0; i--) {
      solution[i] = vector[i] / matrix[i][i];
      for (let j = i - 1; j >= 0; j--) {
        vector[j] -= matrix[j][i] * solution[i];
      }
    }
    
    const solutionTable = document.getElementById("solution-table");
    const solutionCells = solutionTable.querySelectorAll("td");
    for (let i = 0; i < solution.length; i++) {
      solutionCells[i].textContent = solution[i].toFixed(2);
    }
  }
  
  const form = document.getElementById("gauss-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault(); 
    solve(); 
  });
  