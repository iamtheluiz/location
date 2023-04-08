import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import * as Location from 'expo-location'

interface PermissionsProps {
  children: ReactNode
}

interface PermissionsContextProps {
  locationGranted: null | boolean
  setLocationGranted: (granted: null | boolean) => void
}

const PermissionsContext = createContext({} as PermissionsContextProps)

export const PermissionsProvider: FC<PermissionsProps> = ({ children }) => {
  const [locationGranted, setLocationGranted] = useState<null | boolean>(null)

  // Get location granted
  useEffect(() => {
    async function getLocationGranted() {
      const { granted } = await Location.getForegroundPermissionsAsync()

      console.log(`PERMISSIONS PROVIDER => location granted: ${granted}`)
      setLocationGranted(granted)
    }

    getLocationGranted()
  }, [])

  return (
    <PermissionsContext.Provider
      value={{
        locationGranted,
        setLocationGranted,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(PermissionsContext)

  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider')
  }

  return context
}
