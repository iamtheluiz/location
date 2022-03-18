import uuid from 'react-native-uuid'
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
  addNewCircle: (circleData: Omit<NotificationArea, 'id'>) => void
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

  function addNewCircle(circleData: Omit<NotificationArea, 'id'>) {
    const circle = {
      id: String(uuid.v4()),
      ...circleData,
    }

    setCircles([...circles, circle])
  }

  return (
    <CirclesContext.Provider
      value={{
        circles,
        setCircles,
        addNewCircle,
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
