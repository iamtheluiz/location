import { createContext, FC, useContext, useState } from 'react'
import { LatLng } from 'react-native-maps'

export type NotificationArea = {
  id: string
  name: string
  radius: number
  latlng: LatLng
}

interface CirclesContextProps {
  circles: NotificationArea[]
  setCircles: (circles: NotificationArea[]) => void
}

const CirclesContext = createContext({} as CirclesContextProps)

export const CirclesProvider: FC = ({ children }) => {
  const [circles, setCircles] = useState<NotificationArea[]>([
    {
      id: '1',
      name: 'ETEC',
      radius: 200,
      latlng: {
        latitude: -24.12249,
        longitude: -46.678339,
      },
    },
  ])

  return (
    <CirclesContext.Provider
      value={{
        circles,
        setCircles,
      }}
    >
      {children}
    </CirclesContext.Provider>
  )
}

export function useCircles() {
  const context = useContext(CirclesContext)

  if (!context) {
    throw new Error('useCircles must be used within a CirclesProvider')
  }

  return context
}
