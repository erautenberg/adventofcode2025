const DAY10 = 10;
parseData(DAY10, (input) => {
  const timeStringDay10 = `Day ${DAY10}, Total Execution Time`;
  console.time(timeStringDay10);

  const timeStringData1 = `Day ${DAY10}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const manual = formatManual(input);
  console.log(manual);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY10}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getTotalButtonPresses(manual);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY10}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay10);
  showAnswers(DAY10, part1, part2);
});

const formatManual = (input) => {
  return input.reduce((acc, curr) => {
    const { groups } =
      curr.match(
        /\[(?<diagram>[\.#]+)\] (?<buttons>(?:\((?:\d+(?:,\d+)*)\) ?)+)\{(?<joltage>\d+(?:,\d+)*)\}/
      ) || {};

    const diagram = groups.diagram.split('').map((c) => (c === '#' ? 1 : 0));

    const buttons = Array.from(
      groups.buttons.matchAll(/\((\d+(?:,\d+)*)\)/g),
      (match) => match[1].split(',').map(Number)
    );
    const joltage = groups.joltage.split(',').map(Number);

    acc.push({ diagram, buttons, joltage });
    return acc;
  }, []);
};

// each row represents the light diagram
// each column in the row represents how the button affects that row
// the last column in the row is the target value from the diagram
// 0 = '.' or OFF
// 1 = '#' or ON
const getMatrix = (diagram, buttons) => {
  return diagram.reduce((acc, curr, index) => {
    const row = buttons.map((b) => (b.includes(index) ? 1 : 0));
    row.push(curr);
    acc.push(row);
    return acc;
  }, []);
};

// Gaussian elimination over GF(2) (binary field):
// https://www.cs.umd.edu/~gasarch/TOPICS/factoring/fastgauss.pdf
const getPivots = (matrix, buttonCount) => {
  const lightCount = matrix.length;
  const pivots = [];

  let curr = 0;
  let pivotRow = -1;
  for (let c = 0; c < buttonCount && curr < lightCount; c++) {
    pivotRow = -1;
    for (let r = curr; r < lightCount; r++) {
      if (matrix[r][c] === 1) {
        pivotRow = r;
        break;
      }
    }
    if (pivotRow !== -1) {
      [matrix[curr], matrix[pivotRow]] = [matrix[pivotRow], matrix[curr]];
      pivots.push(c);

      for (let r = 0; r < lightCount; r++) {
        if (r !== curr && matrix[r][c] === 1) {
          matrix[r].forEach((b, i) => {
            if (i <= buttonCount) matrix[r][i] ^= matrix[curr][i];
          });
        }
      }
      curr++;
    }
  }

  return { matrix, pivots };
};

// "free variables" = non-pivots:
// https://math.libretexts.org/Courses/Irvine_Valley_College/Math_26%3A_Introduction_to_Linear_Algebra/01%3A_Systems_of_Linear_Equations/1.02%3A_Row_Reduction/1.2.03%3A_Free_Variables
const getFreeVariables = (pivots, buttonCount) => {
  let freeVariables = [];
  for (let i = 0; i < buttonCount; i++)
    if (!pivots.includes(i)) freeVariables.push(i);
  return freeVariables;
};

const getButtonOptions = (diagram, buttons) => {
  const buttonCount = buttons.length;
  const { matrix, pivots } = getPivots(
    getMatrix(diagram, buttons),
    buttonCount
  );
  const freeVariables = getFreeVariables(pivots, buttonCount);
  return { matrix, pivots, freeVariables };
};

// Generate a solution given values for free variables
const getButtonPresses = (
  { matrix, pivots, freeVariables },
  buttonCount,
  freePresses
) => {
  const presses = new Array(buttonCount).fill(0);
  freeVariables.forEach((c, i) => (presses[c] = freePresses[i]));

  pivots.forEach((c, i) => {
    presses[c] = matrix[i][buttonCount]; // target from diagram (on or off)
    freeVariables.forEach((j) => {
      // if button will toggle this light position, flip it
      if (matrix[i][j] === 1) presses[c] ^= presses[j];
    });
  });

  return presses;
};

const findMinimumPresses = ({ diagram, buttons }) => {
  console.log(diagram, buttons);
  const matrixObj = getButtonOptions(diagram, buttons);
  const freeVarsCount = matrixObj.freeVariables.length;
  const possibleCombos = 1 << freeVarsCount; // the same as 2^freeVarsCount

  let bestCombo, bestCount; // minimum number of button presses
  for (let i = 0; i < possibleCombos; i++) {
    // was having a hard time keeping track of the bitwise shifting here and this was clearer for me
    const binary = i.toString(2).padStart(freeVarsCount, '0');
    const freePresses = binary.split('').map(Number);

    const presses = getButtonPresses(matrixObj, buttons.length, freePresses);
    const pressCount = presses.reduce((sum, x) => sum + x, 0);

    if (!bestCount || pressCount < bestCount) {
      bestCount = pressCount;
      bestCombo = presses;
    }
  }

  const buttonPositions = bestCombo.reduce((acc, curr, i) => {
    if (curr === 1) acc.push(i);
    return acc;
  }, []);

  return {
    presses: bestCount,
    buttons: buttonPositions
  };
};

const getTotalButtonPresses = (manual) => {
  return manual.reduce(
    (acc, curr) => (acc += findMinimumPresses(curr).presses),
    0
  );
};
