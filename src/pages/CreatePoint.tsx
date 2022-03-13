import { TouchableOpacity } from 'react-native'
import { Container, Header, Title } from '../styles/Global'

import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

export default function CreatePoint() {
  const navigation = useNavigation()

  return (
    <Container>
      <Header>
        <TouchableOpacity onPress={() => navigation.navigate('Map' as never)}>
          <Feather name="arrow-left" size={28} color="black" />
        </TouchableOpacity>
        <Title>Create</Title>
      </Header>
    </Container>
  )
}
