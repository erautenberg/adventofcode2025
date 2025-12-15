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
  const part2 = getTotalButtonPresses(manual, true);
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

// each row represents the light diagram OR the needed joltage counts
// each column in the row represents how the button affects that row
// the last column in the row is the target value from the diagram (if includeTarget is true)
// 0 = '.' or OFF
// 1 = '#' or ON
const getMatrix = (target, buttons, includeTarget = true) => {
  return target.reduce((acc, curr, index) => {
    const row = buttons.map((b) => (b.includes(index) ? 1 : 0));
    if (includeTarget) row.push(curr);
    acc.push(row);
    return acc;
  }, []);
};

// Gaussian elimination over GF(2) (binary field):
// https://www.cs.umd.edu/~gasarch/TOPICS/factoring/fastgauss.pdf
const getPivotsGF2 = (matrix, buttonCount) => {
  const lightCount = matrix.length;
  const pivots = [];
  const formattedMatrix = matrix.map((row) => [...row]); // Create deep copy to avoid mutating original

  let curr = 0;
  let pivotRow = -1;
  for (let c = 0; c < buttonCount && curr < lightCount; c++) {
    pivotRow = -1;
    for (let r = curr; r < lightCount; r++) {
      if (formattedMatrix[r][c] === 1) {
        pivotRow = r;
        break;
      }
    }
    if (pivotRow !== -1) {
      [formattedMatrix[curr], formattedMatrix[pivotRow]] = [
        formattedMatrix[pivotRow],
        formattedMatrix[curr]
      ];
      pivots.push(c);

      for (let r = 0; r < lightCount; r++) {
        if (r !== curr && formattedMatrix[r][c] === 1) {
          formattedMatrix[r].forEach((_, i) => {
            if (i <= buttonCount)
              formattedMatrix[r][i] ^= formattedMatrix[curr][i];
          });
        }
      }
      curr++;
    }
  }

  return { matrix: formattedMatrix, pivots };
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
  const { matrix, pivots } = getPivotsGF2(
    getMatrix(diagram, buttons),
    buttonCount
  );
  const freeVariables = getFreeVariables(pivots, buttonCount);
  return { matrix, pivots, freeVariables };
};

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
  const matrixObj = getButtonOptions(diagram, buttons);
  const freeVarsCount = matrixObj.freeVariables.length;
  const possibleCombos = 1 << freeVarsCount; // the same as 2^freeVarsCount

  let bestCombo, bestCount; // minimum number of button presses
  for (let i = 0; i < possibleCombos; i++) {
    // was having a hard time keeping track of the bitwise shifting here and this was clearer for me
    // toString(2) makes it binary, padStart ensures it's the right number of digits
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

const getTotalButtonPresses = (manual, forJoltage) => {
  return manual.reduce(
    (acc, curr) =>
      (acc += forJoltage
        ? findMinimumPressesForJoltage(curr)
        : findMinimumPresses(curr).presses),
    0
  );
};

const PIVOT_TOLERANCE = 1e-9;
const INTEGER_TOLERANCE = 1e-4;

// regular Gaussian elimination with floating point arithmetic
const getPivots = (matrix, target, buttonCount) => {
  const lightCount = matrix.length;
  const pivots = [];
  const columnToPivotRow = new Map();
  const formattedMatrix = matrix.map((row) => [...row]); // Create deep copy to avoid mutating original
  const joltage = [...target]; // Create copy to avoid mutating original

  let curr = 0;
  let pivotRow = -1;
  for (let c = 0; c < buttonCount && curr < lightCount; c++) {
    pivotRow = -1;
    for (let r = curr; r < lightCount; r++) {
      // since the divisions below will create decimal numbers, we are at risk of rounding errors
      // we need to figure out which numbers are "significantly" different from 0
      // ie. 0.001 > 0.000000001 is true, so it is non-zero, therefore, a pivot
      // 0.000000000001 < 0.000000001 is false, so it might as well be zero, therefore, NOT a pivot
      if (Math.abs(formattedMatrix[r][c]) > PIVOT_TOLERANCE) {
        pivotRow = r;
        break;
      }
    }
    if (pivotRow !== -1) {
      [formattedMatrix[curr], formattedMatrix[pivotRow]] = [
        formattedMatrix[pivotRow],
        formattedMatrix[curr]
      ];
      [joltage[curr], joltage[pivotRow]] = [joltage[pivotRow], joltage[curr]];

      pivots.push(c);
      columnToPivotRow.set(c, curr);

      // normalize row (make pivot value equal to 1)
      // row echelon form requires leading formattedMatrix (pivots) to be 1
      const pivotVal = formattedMatrix[curr][c];
      for (let i = 0; i < buttonCount; i++) {
        formattedMatrix[curr][i] /= pivotVal;
      }
      joltage[curr] /= pivotVal;

      // elimination
      for (let r = 0; r < lightCount; r++) {
        // if row doesn't already start with a 0, need to eliminate column of new pivot in those rows
        if (r !== curr && Math.abs(formattedMatrix[r][c]) > PIVOT_TOLERANCE) {
          const factor = formattedMatrix[r][c];
          for (let i = 0; i < buttonCount; i++) {
            formattedMatrix[r][i] -= factor * formattedMatrix[curr][i];
          }
          joltage[r] -= factor * joltage[curr];
        }
      }
      curr++;
    }
  }

  return { formattedMatrix, target: joltage, pivots, columnToPivotRow };
};

// a button should never be pressed more times than the smallest joltage it affects
const getButtonPressMaxesForJoltage = (buttons, joltage) => {
  return buttons.reduce((acc, curr) => {
    let min;
    for (const item of curr) {
      // if a button affects multiple counters, the max number of times it can be pressed
      // is equal to the smallest joltage in the set of affected counters
      if (!min || joltage[item] < min) min = joltage[item];
    }
    acc.push(min ?? 0);
    return acc;
  }, []);
};

// Referenced this:
// https://www.reddit.com/r/adventofcode/comments/1pity70/comment/ntb1f29/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
// https://gitlab.com/sunderee/advent-of-code-typescript/-/blob/master/src/solutions/2025/day10.ts
const findMinimumPressesForJoltage = ({ joltage, buttons }) => {
  const buttonCount = buttons.length;
  const matrix = getMatrix(joltage, buttons, false);
  const maxPresses = getButtonPressMaxesForJoltage(buttons, joltage);

  const { formattedMatrix, target, pivots, columnToPivotRow } = getPivots(
    matrix,
    joltage,
    buttonCount
  );

  const freeVariables = getFreeVariables(pivots, buttonCount);

  return getMinimumButtonPressesForJoltage(
    0,
    0,
    formattedMatrix,
    target,
    maxPresses,
    freeVariables,
    pivots,
    columnToPivotRow,
    new Array(buttonCount).fill(0),
    Infinity
  );
};

const getButtonPressesForJoltage = (
  currCost,
  matrix,
  target,
  maxPresses,
  pivots,
  columnToPivotRow,
  currCombo,
  minPresses
) => {
  let currTotal = currCost;

  for (let i = pivots.length - 1; i >= 0; i--) {
    const pivotColumn = pivots[i];
    const pivotRow = columnToPivotRow.get(pivotColumn);
    let currPresses = target[pivotRow];

    // "back-substitution"
    // solve for pivot using known values from buttons to the right
    for (let j = pivotColumn + 1; j < currCombo.length; j++) {
      if (Math.abs(matrix[pivotRow][j]) > PIVOT_TOLERANCE) {
        currPresses -= matrix[pivotRow][j] * currCombo[j];
      }
    }

    // if close enough to an integer
    if (Math.abs(currPresses - Math.round(currPresses)) > INTEGER_TOLERANCE) {
      return minPresses;
    }
    currPresses = Math.round(currPresses);

    // can't be more than max presses allowed
    if (currPresses < 0 || currPresses > maxPresses[pivotColumn]) {
      return minPresses;
    }

    currCombo[pivotColumn] = currPresses;
    currTotal += currPresses;

    // if more expensive, bail
    if (currTotal >= minPresses) {
      return minPresses;
    }
  }

  return currTotal;
};

// DFS (depth-first search)
const getMinimumButtonPressesForJoltage = (
  currFreeVarIndex,
  currCost,
  matrix,
  target,
  maxPresses,
  freeVariables,
  pivots,
  columnToPivotRow,
  currCombo,
  minPresses
) => {
  if (currCost >= minPresses) return minPresses;

  // if all free variables have been assigned values
  if (currFreeVarIndex === freeVariables.length) {
    return getButtonPressesForJoltage(
      currCost,
      matrix,
      target,
      maxPresses,
      pivots,
      columnToPivotRow,
      currCombo,
      minPresses
    );
  }

  const buttonIndex = freeVariables[currFreeVarIndex];
  const maxPressesForButton = maxPresses[buttonIndex];

  let best = minPresses;
  for (let presses = 0; presses <= maxPressesForButton; presses++) {
    currCombo[buttonIndex] = presses;
    const result = getMinimumButtonPressesForJoltage(
      currFreeVarIndex + 1,
      currCost + presses,
      matrix,
      target,
      maxPresses,
      freeVariables,
      pivots,
      columnToPivotRow,
      currCombo,
      best
    );
    best = Math.min(best, result);
  }

  return best;
};
