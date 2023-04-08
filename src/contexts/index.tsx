import { FC, ReactElement } from 'react'
import { CirclesProvider } from './circles'
import { PermissionsProvider } from './permissions'

interface ApplicationContextProviderProps {
  children: ReactElement
}

export const ApplicationContextProvider: FC<
  ApplicationContextProviderProps
> = ({ children }) => {
  return (
    <PermissionsProvider>
      <CirclesProvider>{children}</CirclesProvider>
    </PermissionsProvider>
  )
}
