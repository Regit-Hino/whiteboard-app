import React, { useRef, useEffect, useState, useCallback } from 'react'
import io, { Socket } from 'socket.io-client'

interface DrawData {
  x: number
  y: number
  prevX: number
  prevY: number
  color: string
  lineWidth: number
}

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [color, setColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(2)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })

  useEffect(() => {
    // Canvas size setup
    const updateCanvasSize = () => {
      if (typeof window !== 'undefined') {
        setCanvasSize({
          width: window.innerWidth - 20,
          height: window.innerHeight - 120
        })
      }
    }
    
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'
    console.log('Connecting to server:', serverUrl)
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    })
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Connected to server:', newSocket.id)
    })

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason)
    })

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error)
    })

    newSocket.on('drawing-data', (data: DrawData[]) => {
      const canvas = canvasRef.current
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      data.forEach(drawData => {
        drawLine(ctx, drawData)
      })
    })

    newSocket.on('draw', (data: DrawData) => {
      console.log('Received draw data:', data)
      const canvas = canvasRef.current
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      drawLine(ctx, data)
    })

    newSocket.on('clear', () => {
      const canvas = canvasRef.current
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const drawLine = (ctx: CanvasRenderingContext2D, data: DrawData) => {
    ctx.beginPath()
    ctx.moveTo(data.prevX, data.prevY)
    ctx.lineTo(data.x, data.y)
    ctx.strokeStyle = data.color
    ctx.lineWidth = data.lineWidth
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawData: DrawData = {
      x,
      y,
      prevX: x,
      prevY: y,
      color,
      lineWidth
    }

    if (e.buttons === 1) {
      const prevX = x - e.movementX
      const prevY = y - e.movementY
      
      drawData.prevX = prevX
      drawData.prevY = prevY

      drawLine(ctx, drawData)
      
      if (socket) {
        console.log('Emitting draw data:', drawData)
        socket.emit('draw', drawData)
      } else {
        console.warn('Socket not connected')
      }
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    if (socket) {
      socket.emit('clear')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)' }}>
      <div style={{ padding: '5px', fontSize: '12px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
        Server URL: {process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}
        {socket ? ` | Connected: ${socket.connected}` : ' | Not connected'}
      </div>
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <label>
          Color: 
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            style={{ marginLeft: '10px', marginRight: '20px' }}
          />
        </label>
        <label>
          Brush Size: 
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            style={{ marginLeft: '10px', marginRight: '20px' }}
          />
          <span>{lineWidth}px</span>
        </label>
        <button 
          onClick={clearCanvas}
          style={{ 
            marginLeft: '20px', 
            padding: '5px 15px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{ 
          border: '1px solid #000', 
          cursor: 'crosshair',
          backgroundColor: 'white'
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  )
}

export default Whiteboard