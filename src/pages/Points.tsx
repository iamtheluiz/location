import { ScrollView, TouchableOpacity } from 'react-native'
import CirclesItem from '../components/CirclesItem'
import { useCircles } from '../contexts/circles'
import { Container, Header } from '../styles/Global'
import { Text, Layout } from '@ui-kitten/components'

import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

export default function Points() {
  const { circles } = useCircles()

  const navigation = useNavigation()

  return (
    <Container>
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
            <Feather name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          <Text category="h1" style={{ color: 'white' }}>
            Pontos
          </Text>
        </Header>
        {circles.length === 0 && (
          <Text category="h6" style={{ color: 'white' }}>
            Não existem pontos cadastros!
          </Text>
        )}
        {circles.map(circle => (
          <CirclesItem key={circle.id} circle={circle} />
        ))}
      </ScrollView>
    </Container>
  )
}
