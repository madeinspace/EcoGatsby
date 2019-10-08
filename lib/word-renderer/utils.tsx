export const pixelsToPointSize = (pixels) => {
  // For some reason, the docx library uses "half-points" refer to text sizes in styles
  // This is different again from the bonkers "20th of a point" unit used elsewhere
  const points = pixels * 0.75
  const halfPoints = points * 2
  return halfPoints
}

export const pixelsToTWIPS = (pixels) => {
  const points = pixels * 0.75
  const twentiethsOfPoints = points * 20
  return twentiethsOfPoints
}

export default {
  pixelsToPointSize,
  pixelsToTWIPS
}