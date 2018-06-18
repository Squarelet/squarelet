export function sideCoords(sq, side) {
  let coords
  switch (side) {
    // LEFT
    case 0:
      coords = [sq.x, sq.y + sq.height / 2.0]
      break
    // TOP
    case 1:
      coords = [sq.x + sq.width/2.0, sq.y]
      break

    // RIGHT
    case 2:
      coords = [sq.x + sq.width, sq.y + sq.height / 2.0]
      break
    // BOTTOM
    case 3:
      coords = [sq.x + sq.width/2.0, sq.y + sq.height]
      break
  }
  return coords
}
