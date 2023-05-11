function parseFunction(funcString) {
  return function(x) {
    return eval(funcString);
  };
}

function submitForm() {
  const funcString = document.getElementById("function").value;
  const start = parseFloat(document.getElementById("start").value);
  const end = parseFloat(document.getElementById("end").value);
  const step = parseFloat(document.getElementById("step").value);
  const tol = parseFloat(document.getElementById("tolerance").value);
  const func = parseFunction(funcString);

  //Графік функції
  plotFunction(func, start, end);
  
  //Дихотомії

  const root = findRoots(start, end, tol, funcString);
  const resultDichotomy = [];
  console.log("dichotomy");
  for (let i = 0; i < root.length; i++) {
    const { x, error, iter } = dichotomySearch(x => f(x, funcString), root[i][0], root[i][1], tol);
    const result = `x = ${x.toFixed(8)}, похибка = ${error.toFixed(8)}, ітерацій = ${iter}`;
    console.log(result);
    resultDichotomy.push(result);
  }
  const outputDichotomy = resultDichotomy.join("<br>");
  document.getElementById("dichotomyOutput").innerHTML = outputDichotomy;


   //Фібоначчі 

   const rot = findRoots(start, end, tol, funcString);
   const resultFibonacci = [];
   console.log("Fibonacci");
   console.log(`Найдено ${rot.length} корня(ей):`);
   for (let i = 0; i < rot.length; i++) {
     const { x, error, iter } = fibonacciSearch(x => f(x, funcString), rot[i][0], rot[i][1], tol);
     const result = `x = ${x.toFixed(8)}, похибка = ${error.toFixed(8)}, ітерацій = ${iter}`;
     console.log(result);
     resultFibonacci.push(result);
   }
   const outputFibonacci = resultFibonacci.join("<br>");
   document.getElementById("fibonacciOutput").innerHTML = outputFibonacci;


  //Золотий перетин
  const roots = findRoots(start, end, tol, funcString);
  const results = [];
  console.log("goldenSection");
  for (let i = 0; i < roots.length; i++) {
    const { x, error, iter } = goldenSectionSearch(x => f(x, funcString), roots[i][0], roots[i][1], tol);
    const result = `x = ${x.toFixed(8)}, похибка = ${error.toFixed(8)}, ітерацій = ${iter}`;
    console.log(result);
    results.push(result);
  }
  const output = results.join("<br>");
  document.getElementById("goldenOutput").innerHTML = output;
}

///////Fibonacci func////////////

function fibonacci(n) {
  if (n <= 1) {
    return 1;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function findFibonacciNumber(limit, target) {
  let n = 0;
  while (fibonacci(n) <= limit) {
    n++;
  }
  let offset = 0;
  while (n > 0) {
    const i = n - 1;
    const fib = fibonacci(i);
    if (offset + fib < limit && target < limit) {
      n = i;
      offset += fib;
    } else {
      n = i - 1;
    }
  }
  return offset;
}

function fibonacciSearch(f, a, b, tol) {
  const maxIterations = 1000;
  let n = 1;
  while (fibonacci(n) <= (b - a) / tol) {
    n++;
  }
  let x1 = a + (b - a) * fibonacci(n - 2) / fibonacci(n);
  let x2 = a + (b - a) * fibonacci(n - 1) / fibonacci(n);
  let f1 = f(x1);
  let f2 = f(x2);
  let iter = 0;
  while (Math.abs(b - a) > tol && iter < maxIterations) {
    if (f1 < f2) {
      b = x2;
      x2 = x1;
      f2 = f1;
      x1 = a + b - x2;
      f1 = f(x1);
    } else {
      a = x1;
      x1 = x2;
      f1 = f2;
      x2 = a + b - x1;
      f2 = f(x2);
    }
    iter++;
  }
  const x = (a + b) / 2;
  const error = Math.abs(b - a);
  return { x, error, iter };
}

//Search roots

function findRoots(a, b, tol, funcString) {
  const roots = [];
  const dx = 0.01;
  let x0 = a;
  let f0 = f(x0, funcString);

  for (let x = a + dx; x <= b; x += dx) {
    const f1 = f(x, funcString);
    if (f0 * f1 < 0) {
      roots.push([x0, x]);
    }
    x0 = x;
    f0 = f1;
  }
  return roots;
}

///////dichotomy func////////////

function dichotomySearch(f, a, b, tol) {
  let iter = 0;
  let x, fx, fa, fb, error;
  do {
    x = (a + b) / 2;
    fx = f(x);
    fa = f(a);
    fb = f(b);

    if (fa * fx < 0) {
      b = x;
    } else {
      a = x;
    }
    error = Math.abs(b - a);
    iter++;
  } while (error > tol);

  return { x: x, error: error, iter: iter };
}

////////////golden func///////////////////////

function f(x, funcString) {
  const func = new Function("x", `return ${funcString};`);
  return func(x);
}

function goldenSectionSearch(f, a, b, tol) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const resphi = 2 - phi;
  let x1 = a + resphi * (b - a);
  let x2 = b - resphi * (b - a);
  let f1 = f(x1);
  let f2 = f(x2);
  let iter = 0;

  while (Math.abs(b - a) > tol) {
    if (f1 > f2) {
      a = x1;
      x1 = x2;
      f1 = f2;
      x2 = b - resphi * (b - a);
      f2 = f(x2);
    } else {
      b = x2;
      x2 = x1;
      f2 = f1;
      x1 = a + resphi * (b - a);
      f1 = f(x1);
    }
    iter++;
  }

  const x = (a + b) / 2;
  const error = Math.abs(b - a);
  return { x, error, iter };
}

////////graphic method//////////////

function plotFunction(func, start, end) {
  const data = [{
    x: getXValues(func, start, end),
    y: getYValues(func, start, end),
    type: 'scatter'
  }];
  const layout = {
    title: 'Графічний метод',
    xaxis: {
      title: 'x'
    },
    yaxis: {
    title: 'y'
    }
    };
    Plotly.newPlot('plot', data, layout);
  }
  function getXValues(func, start, end) {
    const step = (end - start) / 1000;
    const xValues = [];
    for (let x = start; x <= end; x += step) {
      xValues.push(x);
    }
    return xValues;
  }

  function getYValues(func, start, end) {
  const xValues = getXValues(func, start, end);
  const yValues = xValues.map(func);
  return yValues;
}