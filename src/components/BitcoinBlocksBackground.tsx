"use client"

import { useEffect, useRef } from "react"

interface Block {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  rotation: number
  rotationSpeed: number
  delay: number
}

export function BitcoinBlocksBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blocksRef = useRef<Block[]>([])
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const createBlocks = () => {
      const blocks: Block[] = []
      const numBlocks = 25

      for (let i = 0; i < numBlocks; i++) {
        blocks.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          size: 20 + Math.random() * 40,
          opacity: 0.1 + Math.random() * 0.3,
          speed: (0.2 + Math.random() * 0.5) * 0.25,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02 * 0.2,
          delay: Math.random() * Math.PI * 2,
        })
      }

      blocksRef.current = blocks
    }

    const drawBlock = (block: Block, time: number) => {
      ctx.save()
      ctx.translate(block.x, block.y)
      ctx.rotate(block.rotation)

      const pulseOpacity = block.opacity * (0.7 + 0.3 * Math.sin(time * 0.001 + block.delay))

      // Outer block outline
      ctx.strokeStyle = `rgba(249, 115, 22, ${pulseOpacity})`
      ctx.lineWidth = 1.5
      ctx.strokeRect(-block.size / 2, -block.size / 2, block.size, block.size)

      // Inner block outline (3D effect)
      const innerOffset = block.size * 0.15
      ctx.strokeStyle = `rgba(251, 146, 60, ${pulseOpacity * 0.6})`
      ctx.lineWidth = 1
      ctx.strokeRect(
        -block.size / 2 + innerOffset,
        -block.size / 2 + innerOffset,
        block.size - innerOffset * 2,
        block.size - innerOffset * 2
      )

      // Connecting lines (chain effect)
      ctx.strokeStyle = `rgba(234, 88, 12, ${pulseOpacity * 0.4})`
      ctx.lineWidth = 0.5

      // Top-left corner detail
      ctx.beginPath()
      ctx.moveTo(-block.size / 2, -block.size / 2)
      ctx.lineTo(-block.size / 2 + innerOffset, -block.size / 2 + innerOffset)
      ctx.stroke()

      // Top-right corner detail
      ctx.beginPath()
      ctx.moveTo(block.size / 2, -block.size / 2)
      ctx.lineTo(block.size / 2 - innerOffset, -block.size / 2 + innerOffset)
      ctx.stroke()

      // Bottom-left corner detail
      ctx.beginPath()
      ctx.moveTo(-block.size / 2, block.size / 2)
      ctx.lineTo(-block.size / 2 + innerOffset, block.size / 2 - innerOffset)
      ctx.stroke()

      // Bottom-right corner detail
      ctx.beginPath()
      ctx.moveTo(block.size / 2, block.size / 2)
      ctx.lineTo(block.size / 2 - innerOffset, block.size / 2 - innerOffset)
      ctx.stroke()

      // Hash-like pattern inside (small dots)
      ctx.fillStyle = `rgba(249, 115, 22, ${pulseOpacity * 0.3})`
      const dotSize = 2
      const dotSpacing = block.size * 0.2
      for (let dx = -1; dx <= 1; dx += 2) {
        for (let dy = -1; dy <= 1; dy += 2) {
          ctx.beginPath()
          ctx.arc(dx * dotSpacing * 0.5, dy * dotSpacing * 0.5, dotSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.restore()
    }

    const getBlockCorners = (block: Block) => {
      const halfSize = block.size / 2
      const cos = Math.cos(block.rotation)
      const sin = Math.sin(block.rotation)
      
      // Calculate rotated corner positions
      const corners = [
        { x: -halfSize, y: -halfSize }, // top-left
        { x: halfSize, y: -halfSize },  // top-right
        { x: halfSize, y: halfSize },   // bottom-right
        { x: -halfSize, y: halfSize },  // bottom-left
      ]
      
      return corners.map((c) => ({
        x: block.x + c.x * cos - c.y * sin,
        y: block.y + c.x * sin + c.y * cos,
      }))
    }

    const drawChainLinks = (time: number) => {
      const blocks = blocksRef.current
      ctx.lineWidth = 1.5
      const maxDist = 200;

      for (let i = 0; i < blocks.length; i++) {
        for (let j = i + 1; j < blocks.length; j++) {
          const a = blocks[i]
          const b = blocks[j]
          const dist = Math.hypot(b.x - a.x, b.y - a.y)

          if (dist < maxDist) {
            const cornersA = getBlockCorners(a)
            const cornersB = getBlockCorners(b)

            // Find the closest pair of corners between the two blocks
            let minDist = Infinity
            let closestA = cornersA[0]
            let closestB = cornersB[0]

            for (const cA of cornersA) {
              for (const cB of cornersB) {
                const d = Math.hypot(cB.x - cA.x, cB.y - cA.y)
                if (d < minDist) {
                  minDist = d
                  closestA = cA
                  closestB = cB
                }
              }
            }

            // Animate opacity with time for a pulsing data-flow effect
            const basePulse = 0.6 + 0.4 * Math.sin(time * 0.003 + i + j * 0.5)
            const opacity = 0.35 * (1 - dist / maxDist) * basePulse
            ctx.strokeStyle = `rgba(249, 115, 22, ${opacity})`

            // Animate dash offset for flowing chain effect
            const dashOffset = (time * 0.05) % 8
            ctx.setLineDash([4, 4])
            ctx.lineDashOffset = -dashOffset

            ctx.beginPath()
            ctx.moveTo(closestA.x, closestA.y)
            ctx.lineTo(closestB.x, closestB.y)
            ctx.stroke()
            ctx.setLineDash([])
          }
        }
      }
    }

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Draw chain links first (behind blocks)
      drawChainLinks(time)

      // Update and draw blocks
      blocksRef.current.forEach((block) => {
        // Float upward like mempool transactions
        block.y -= block.speed
        block.x += Math.sin(time * 0.0005 + block.delay) * 0.3
        block.rotation += block.rotationSpeed

        // Reset when off screen
        if (block.y < -block.size) {
          block.y = canvas.offsetHeight + block.size
          block.x = Math.random() * canvas.offsetWidth
        }

        // Wrap horizontally
        if (block.x < -block.size) block.x = canvas.offsetWidth + block.size
        if (block.x > canvas.offsetWidth + block.size) block.x = -block.size

        drawBlock(block, time)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    createBlocks()
    animationRef.current = requestAnimationFrame(animate)

    window.addEventListener("resize", () => {
      resizeCanvas()
      createBlocks()
    })

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: "transparent" }}
    />
  )
}
