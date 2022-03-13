import { ScrollView } from 'react-native'
import CirclesItem from '../components/CirclesItem'
import { useCircles } from '../contexts/circles'
import { Container } from '../styles/Global'

export default function Points() {
  const { circles } = useCircles()

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
        {circles.map(circle => (
          <CirclesItem key={circle.id} circle={circle} />
        ))}
      </ScrollView>
    </Container>
  )
}
