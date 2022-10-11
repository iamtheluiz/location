import { ScrollView, TouchableOpacity } from 'react-native'
import CirclesItem from '../components/CirclesItem'
import { useCircles } from '../contexts/circles'
import { Header } from '../styles/Global'
import { Text, Layout } from '@ui-kitten/components'

import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

export default function Points() {
  const { circles } = useCircles()

  const navigation = useNavigation()

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ScrollView
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          padding: 24,
          marginTop: 20,
        }}
      >
        <Header>
          <TouchableOpacity onPress={() => navigation.navigate('Map' as never)}>
            <Feather name="arrow-left" size={28} color="black" />
          </TouchableOpacity>
          <Text category="h1">Pontos</Text>
        </Header>
        {circles.length === 0 && (
          <Text category="h6">Não existem pontos cadastros!</Text>
        )}
        {circles.map(circle => (
          <CirclesItem key={circle.id} circle={circle} />
        ))}
      </ScrollView>
    </Layout>
  )
}
