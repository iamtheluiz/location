import { StatusBar } from 'expo-status-bar'
import styled from 'styled-components/native'
import MapView from 'react-native-maps'

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`

export default function App() {
  return (
    <Container>
      <StatusBar style="auto" />
      <MapView
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </Container>
  )
}
