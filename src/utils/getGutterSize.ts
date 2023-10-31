export default function getGutterSizes(
  gutterSize: number,
  isFirst: boolean,
  isLast: boolean
) {
  let aGutterSize: number;
  let bGutterSize: number;

  if (isFirst && isLast) {
    aGutterSize = gutterSize / 2;
    bGutterSize = gutterSize / 2;
  } else if (isFirst) {
    aGutterSize = gutterSize / 2;
    bGutterSize = gutterSize;
  } else if (isLast) {
    aGutterSize = gutterSize;
    bGutterSize = gutterSize / 2;
  } else {
    aGutterSize = gutterSize;
    bGutterSize = gutterSize;
  }
  return { aGutterSize, bGutterSize };
}
