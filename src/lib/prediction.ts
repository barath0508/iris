export type IrisSpecies = 'setosa' | 'versicolor' | 'virginica';

export function predictIris(
  sepalLength: number,
  sepalWidth: number,
  petalLength: number,
  petalWidth: number
): IrisSpecies {
  // A simplified decision tree model based on common Iris dataset features
  if (petalWidth < 0.8) {
    return 'setosa';
  }
  if (petalWidth < 1.75) {
    if (petalLength < 4.95 && petalWidth < 1.65) {
      return 'versicolor';
    }
    if (petalLength < 4.85) {
      return 'versicolor';
    }
    return 'virginica';
  }
  return 'virginica';
}
