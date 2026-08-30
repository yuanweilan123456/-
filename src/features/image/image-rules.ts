export function shouldKeepOriginal(
  inputSize: number,
  outputSize: number,
  inputMime: string,
  outputMime: string,
  dimensionsChanged: boolean,
  rotation: number,
  flipHorizontal: boolean,
  flipVertical: boolean,
) {
  return (
    outputSize >= inputSize &&
    inputMime === outputMime &&
    !dimensionsChanged &&
    rotation === 0 &&
    !flipHorizontal &&
    !flipVertical
  )
}
