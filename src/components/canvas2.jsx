import { useEffect, useRef, useState } from 'react'

const style = {
  canvas: {
    width: '80vw',
    height: '60vh',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'rgb(0 0 0 / 70%)',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  btnContainer: {
    display: 'flex',
    gap: '1rem',
  },
}

const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame

const cancelAnimationFrame =
  window.cancelAnimationFrame || window.mozCancelAnimationFrame

function Graph() {
  const canvasRef = useRef(null)
  const [canvasInstance, setCanvasInstance] = useState(null)
  const [requestId, setRequestId] = useState(null)

  function createChart() {
    let ctx = canvasInstance

    //  Params         ctx, (start),(control), (end pnt) , duration
    //  Params         ctx, x0,|y0| , x1 , y1 , x2 ,|y2|, duration
    animatePathDrawing(ctx, 39, 600, 600, 600, 800, 60, 10000)
  }

  // Clears the drawn line
  function clearChart() {
    let ctx = canvasInstance
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    drawAxis(ctx, ctx.canvas.width, ctx.canvas.height)
  }

  // Stops the animation
  function stopAnimation() {
    cancelAnimationFrame(requestId)
  }

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    setCanvasInstance(ctx)

    drawAxis(ctx, canvas.width, canvas.height)
  }, [])

  /**
   * Animates bezier-curve
   *
   * @param ctx       The canvas context to draw to
   * @param x0        The x-coord of the start point
   * @param y0        The y-coord of the start point
   * @param x1        The x-coord of the control point
   * @param y1        The y-coord of the control point
   * @param x2        The x-coord of the end point
   * @param y2        The y-coord of the end point
   * @param duration  The duration in milliseconds
   */
  function animatePathDrawing(ctx, x0, y0, x1, y1, x2, y2, duration) {
    let start = null
    let reqId = null

    let step = function animatePathDrawingStep(timestamp) {
      if (start === null) start = timestamp

      let delta = timestamp - start,
        progress = Math.min(delta / duration, 1)

      // Clear canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      drawAxis(ctx, ctx.canvas.width, ctx.canvas.height)
      drawScales(ctx, ctx.canvas.width, ctx.canvas.height, progress)

      // Draw curve
      drawBezierSplit(ctx, x0, y0, x1, y1, x2, y2, 0, progress)

      if (progress < 1) {
        reqId = requestAnimationFrame(step)
        setRequestId(() => reqId)
      }
    }

    requestAnimationFrame(step)
  }

  return (
    <section style={style.container}>
      <div style={style.btnContainer}>
        <button onClick={createChart} style={style.button}>
          Draw Line
        </button>
        <button onClick={clearChart} style={style.button}>
          Clear Chart
        </button>
        <button onClick={stopAnimation} style={style.button}>
          Stop Animation
        </button>
      </div>

      <canvas
        ref={canvasRef}
        id='canvas'
        className='copter-gri'
        width='960'
        height='640'
        style={style.canvas}
      ></canvas>
    </section>
  )
}

export default Graph

/**
 * Draws a splitted bezier-curve
 *
 * @param ctx       The canvas context to draw to
 * @param x0        The x-coord of the start point
 * @param y0        The y-coord of the start point
 * @param x1        The x-coord of the control point
 * @param y1        The y-coord of the control point
 * @param x2        The x-coord of the end point
 * @param y2        The y-coord of the end point
 * @param t0        The start ratio of the splitted bezier from 0.0 to 1.0
 * @param t1        The start ratio of the splitted bezier from 0.0 to 1.0
 */
function drawBezierSplit(ctx, x0, y0, x1, y1, x2, y2, t0, t1) {
  ctx.beginPath()

  if (0.0 == t0 && t1 == 1.0) {
    ctx.moveTo(x0, y0)
    ctx.quadraticCurveTo(x1, y1, x2, y2)
  } else if (t0 != t1) {
    var t00 = t0 * t0,
      t01 = 1.0 - t0,
      t02 = t01 * t01,
      t03 = 2.0 * t0 * t01

    var nx0 = t02 * x0 + t03 * x1 + t00 * x2,
      ny0 = t02 * y0 + t03 * y1 + t00 * y2

    t00 = t1 * t1
    t01 = 1.0 - t1
    t02 = t01 * t01
    t03 = 2.0 * t1 * t01

    var nx2 = t02 * x0 + t03 * x1 + t00 * x2,
      ny2 = t02 * y0 + t03 * y1 + t00 * y2

    var nx1 = lerp(lerp(x0, x1, t0), lerp(x1, x2, t0), t1),
      ny1 = lerp(lerp(y0, y1, t0), lerp(y1, y2, t0), t1)

    ctx.moveTo(nx0, ny0)
    ctx.quadraticCurveTo(nx1, ny1, nx2, ny2)
  }

  ctx.strokeStyle = 'green'
  ctx.lineWidth = 5
  ctx.stroke()
  ctx.closePath()
}

/**
 * Linearly interpolates between two numbers
 */
function lerp(v0, v1, t) {
  return (1.0 - t) * v0 + t * v1
}

// Draw x and Y axis
function drawAxis(ctx, width, height) {
  //Draw x axis
  ctx.beginPath()
  ctx.moveTo(width * 0.038, height * 0.94)
  ctx.lineTo(width * 0.98, height * 0.94)
  ctx.strokeStyle = 'gray'
  ctx.lineWidth = 5
  ctx.stroke()

  // Draw y axis
  ctx.beginPath()
  ctx.moveTo(width * 0.04, height * 0.02)
  ctx.lineTo(width * 0.04, height * 0.944)
  ctx.strokeStyle = 'gray'
  ctx.lineWidth = 4
  ctx.stroke()
}

function drawScales(ctx, width, height, progress) {
  for (let i = 0; i < 10; i++) {
    drawXscale(
      ctx,
      i + 1,
      width * 0.1 + ((width * 0.9) / 10) * i,
      height * 0.94,
      width * 0.1 + ((width * 0.9) / 10) * i,
      height * 0.96,
    )
    // Draw y axis scale
    drawYscale(
      ctx,
      i + 1,
      width * 0.025,
      height * 0.85 - ((height * 0.9) / 10) * i,
      width * 0.04,
      height * 0.85 - ((height * 0.9) / 10) * i,
    )
  }
}

function drawXscale(ctx, label, xStart, yStart, xEnd, yEnd) {
  ctx.beginPath()
  ctx.moveTo(xStart, yStart)
  ctx.lineTo(xEnd, yEnd)
  ctx.strokeStyle = 'gray'
  ctx.lineWidth = 5
  ctx.stroke()

  ctx.font = '20px Arial'
  ctx.fillStyle = 'black'

  //Uncomment to get scale label
  //ctx.fillText(label, xStart - 5, yStart + 30)
}

function drawYscale(ctx, label, xStart, yStart, xEnd, yEnd) {
  ctx.beginPath()
  ctx.moveTo(xStart, yStart)
  ctx.lineTo(xEnd, yEnd)
  ctx.strokeStyle = 'gray'
  ctx.lineWidth = 5
  ctx.stroke()

  ctx.font = '20px Arial'
  ctx.fillStyle = 'black'

  //Uncomment to get scale label
  //ctx.fillText(label, xStart - 20, yStart + 5)
}
