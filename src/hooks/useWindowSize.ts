import { useEffect, useState } from 'react'

type WindowDimentions = {
  width: number | undefined
  height: number | undefined
}

const useWindowSize = (): WindowDimentions => {
  const [windowSize, setWindowSize] = useState<WindowDimentions>({
    width: undefined,
    height: undefined
  })

  useEffect(() => {
    function handleResize(): void {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return (): void => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

export default useWindowSize
