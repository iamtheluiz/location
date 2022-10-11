import { useEffect, useRef } from 'react'
import LottieView from 'lottie-react-native'
import { Layout, Text } from '@ui-kitten/components'

import locationAnimation from '../assets/lottie/location.json'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function Start() {
  const animation = useRef(null)
  const navigation = useNavigation()

  useEffect(() => {
    // animation.current.play()
  }, [])

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 320,
          height: 320,
        }}
        source={locationAnimation}
      />
      <Text category="h1">Boas Vindas</Text>
      <TouchableOpacity
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: '#29c5e1',
          borderRadius: 6,
          marginTop: 12,
        }}
        onPress={() => navigation.navigate('Map' as never)}
      >
        <Text category="h5">Abrir Mapa</Text>
      </TouchableOpacity>
    </Layout>
  )
}
