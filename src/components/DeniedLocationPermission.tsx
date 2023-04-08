/* eslint-disable react/no-unescaped-entities */
import { Button, Card, Modal, Text } from '@ui-kitten/components'

import { Linking, Platform } from 'react-native'
import { getLocationPermission } from '../utils/getLocationPermission'
import { useState } from 'react'
import { usePermissions } from '../contexts/permissions'

const handleOpenSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:')
  } else {
    Linking.openSettings()
  }
}

export default function DeniedLocationPermission() {
  const [visible, setVisible] = useState(true)
  const { setLocationGranted } = usePermissions()

  async function requestLocationPermission() {
    const granted = await getLocationPermission()

    setLocationGranted(granted)

    if (granted) {
      setVisible(false)
    }
  }

  return (
    <Modal visible={visible}>
      <Card disabled={true}>
        <Text category="h5">Permissão Necessária</Text>
        <Text style={{ marginVertical: 6 }}>
          Para o aplicativo funcionar, é necessário permitir acesso a
          localização do aparelho.
        </Text>
        <Text style={{ marginBottom: 12 }}>
          Acesse as configurações do aplicativo, na opção "Permissões" e permita
          o acesso da "Localização".
        </Text>
        <Button
          onPress={handleOpenSettings}
          status="primary"
          style={{ marginBottom: 6 }}
        >
          Abrir Configurações
          {/* Allow Location Usage */}
        </Button>
        <Button onPress={requestLocationPermission} status="basic">
          Atualizei a Permissão
          {/* Allow Location Usage */}
        </Button>
      </Card>
    </Modal>
  )
}
