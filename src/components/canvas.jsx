import { useEffect, useRef, useState } from 'react'

const style = {
  canvas: {
    width: '80vw',
    height: '60vh',
    // border: '2px solid #000000',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
  },
}

function Copter() {
  const canvasRef = useRef(null)
  const [canvasInstance, setCanvasInstance] = useState(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const canvasObj = new Canvas(canvas)
    setCanvasInstance(canvasObj)

    canvasObj.handleResize()
    canvasObj.drawGraph()

    // Cleanup on component unmount
    return () => {
      canvasObj.clearCanvas()
    }
  }, [])

  // Handle window resize
  const handleResize = () => {
    if (canvasInstance) {
      canvasInstance.handleResize()
      // canvasInstance.drawCircle(50, 'green') // Redraw the circle after resize
      canvasInstance.drawGraph()
    }
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div>
      <canvas
        ref={canvasRef}
        id='canvas'
        className='copter-gri'
        style={style.canvas}
      ></canvas>
    </div>
  )
}

export default Copter

class Canvas {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.center = {
      x: this.width / 2,
      y: this.height / 2,
    }
    this.animationProgress = 0
    this.animationSpeed = 0.001
  }

  drawGraph() {
    this.clearCanvas()
    // Draw x and y axis
    this.drawAxis()
    // Draw x and y axis scale
    this.drawXScale()
    this.drawYScale()

    // Draw x and y axis labels
    // this.drawXLabel()
    // this.drawYLabel()

    // Draw bezier curve
    this.drawAnimatedBezierCurve()
  }

  // Draw x and y axix
  drawAxis() {
    //Draw x axis
    this.ctx.beginPath()
    this.ctx.moveTo(this.width * 0.04, this.height * 0.94)
    this.ctx.lineTo(this.width * 0.98, this.height * 0.94)
    this.ctx.strokeStyle = 'gray'
    this.ctx.lineWidth = 5
    this.ctx.stroke()

    // Draw y axis
    this.ctx.beginPath()
    this.ctx.moveTo(this.width * 0.04, this.height * 0.02)
    this.ctx.lineTo(this.width * 0.04, this.height * 0.94)
    this.ctx.strokeStyle = 'gray'
    this.ctx.lineWidth = 4
    this.ctx.stroke()
  }

  // Draw x axis scale
  drawXScale() {
    this.ctx.beginPath()
    this.ctx.moveTo(this.width * 0.1, this.height * 0.94)
    this.ctx.lineTo(this.width * 0.1, this.height * 0.96)
    this.ctx.strokeStyle = 'gray'
    this.ctx.lineWidth = 5
    this.ctx.stroke()
  }

  // Draw y axis scale
  drawYScale() {
    this.ctx.beginPath()
    this.ctx.moveTo(this.width * 0.025, this.height * 0.8)
    this.ctx.lineTo(this.width * 0.04, this.height * 0.8)
    this.ctx.strokeStyle = 'gray'
    this.ctx.lineWidth = 5
    this.ctx.stroke()
  }

  // Draw x axis label
  drawXLabel() {
    this.ctx.font = '30px Arial'
    this.ctx.fillStyle = 'red'
    this.ctx.fillText('x', this.width * 0.92, this.height * 0.98)
  }

  // Draw y axis label
  drawYLabel() {
    this.ctx.font = '30px Arial'
    this.ctx.fillStyle = 'blue'
    this.ctx.fillText('y', this.width * 0.02, this.height * 0.1)
  }

  // Draw bezier curve
  drawBezierCurve() {
    this.ctx.beginPath()
    this.ctx.moveTo(this.width, this.height * 0.3)
    this.ctx.quadraticCurveTo(
      this.width * 0.6,
      this.height * 0.9,
      this.width * 0.04,
      this.height * 0.94,
    )
    this.ctx.strokeStyle = 'green'
    this.ctx.stroke()
  }

  // Draw animated bezier curve
  drawAnimatedBezierCurve() {
    // Update the animation progress
    this.animationProgress += this.animationSpeed

    // Ensure the animation progress stays within bounds (0 to 1)
    this.animationProgress = Math.min(1, Math.max(0, this.animationProgress))

    // Calculate the current positon based on animation progress
    const currentX = this.width * this.animationProgress
    const currentY = this.height * this.animationProgress

    // Draw the animated bezier curve
    const endX = this.width * (this.animationProgress + 0.0001)
    const endY = this.height * (0.3 / (this.animationProgress + 0.0001))
    //const controlX = this.width * 0.6 * this.animationProgress // Adjust the control point
    //const controlY = this.height * 0.9 * this.animationProgress
    const controlX = endX * 0.6
    const controlY = this.height * 0.9
    const startX = this.width * 0.04
    const startY = this.height * 0.94
    console.log('endX', endX)
    console.log('endY', endY)

    // Draw the gradient
    const gradient = this.ctx.createLinearGradient(0, this.height, 0, 0)
    gradient.addColorStop(0, 'rgba(0, 255, 0, 0)') // Transparent at the bottom
    gradient.addColorStop(1, 'rgba(0, 255, 0, 1)') // Fully visible at the top
    this.ctx.fillStyle = gradient
      this.ctx.fill()

    this.ctx.beginPath()
    this.ctx.moveTo(endX, endY)
    this.ctx.quadraticCurveTo(controlX, controlY, startX, startY)
    this.ctx.strokeStyle = 'green'
    this.ctx.stroke()

    if (this.animationProgress < 1) {
      console.log(this.animationProgress)
      requestAnimationFrame(() => this.drawGraph())
    }
  }

  // Draw a circle
  drawCircle(radius, color) {
    let x = this.width / 2
    let y = this.height / 2
    let rad = Math.min(x, y) * 0.8

    this.ctx.beginPath()
    this.ctx.arc(x, y, rad, 0, Math.PI * 2, false)
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = 5
    this.ctx.stroke()
  }

  // Handle canvas resize
  handleResize() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.center = {
      x: this.width / 2,
      y: this.height / 2,
    }
    this.canvas.width = this.width
    this.canvas.height = this.height
  }

  // Clear the canvas
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}
