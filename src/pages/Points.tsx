import { Text } from 'react-native'
import { useCircles } from '../contexts/circles'
import { Container } from '../styles/Global'

export default function Points() {
  const { circles } = useCircles()

  return (
    <Container>
      {circles.map(circle => (
        <Text key={circle.id}>{circle.name}</Text>
      ))}
    </Container>
  )
}
