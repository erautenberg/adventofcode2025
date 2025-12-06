function consoleAnswers(day, part, answer) {
  console.log(`Day ${day}, Part ${part}: ${answer}`);
}

function showAnswers(day, part1, part2) {
  consoleAnswers(day, 1, part1);
  document.getElementById('answer1').innerHTML = part1;
  consoleAnswers(day, 2, part2);
  document.getElementById('answer2').innerHTML = part2;
}

function parseData(day, callback) {
  return fetch(`../input/${day}.txt`)
    .then((res) => res.text())
    .then((text) => {
      const parsedText = text.split('\n');
      if (parsedText[parsedText.length - 1] === '') {
        parsedText.pop();
      }
      return callback(parsedText);
    });
}

function filterDuplicates(arr) {
  return arr.filter((a, index) => arr.indexOf(a) === index);
}

function getPermutations(arr) {
  if (arr.length < 2) {
    return arr;
  }
  let permutationsArray = [];
  for (let i = 0; i < arr.length; i++) {
    let curr = arr[i];
    if (arr.indexOf(curr) != i) {
      continue;
    }
    let remainder = arr.slice();
    remainder.splice(i, 1);
    for (let permutation of getPermutations(remainder)) {
      permutationsArray.push([curr, permutation].flat());
    }
  }
  return permutationsArray;
}

function transpose(matrix) {
  return Object.keys(matrix[0]).map((colNumber) =>
    matrix.map((rowNumber) => rowNumber[colNumber])
  );
}

function invertRowsAndColumns(grid) {
  return grid.reduce(
    (acc, row) =>
      row.map((column, columnIndex) =>
        (acc[columnIndex] || []).concat(row[columnIndex])
      ),
    []
  );
}

function deepCopy2DArray(arr) {
  return arr.map((row) => row.map((column) => column));
}

// NAVIGATION
function makeNavigation(days) {
  let nav = document.getElementById('nav');
  if (document.location.pathname !== '/') {
    nav.appendChild(makeHyperlink('View All', ''));
  }
  for (let i = 1; i <= days; i++) {
    nav.appendChild(makeHyperlink(`Day ${i}`, `days/${i}.html`));
  }
}

function makeHyperlink(title, location) {
  let list = document.createElement('li');
  let link = document.createElement('a');
  link.href = `http://${window.location.host}/${location}`;
  link.innerHTML = title;
  list.appendChild(link);
  return list;
}

const DAYS_COMPLETED = 6;
makeNavigation(DAYS_COMPLETED);
