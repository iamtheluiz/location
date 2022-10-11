import { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { useNavigation } from '@react-navigation/native'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Circle, LatLng } from 'react-native-maps'

import {
  Button,
  ButtonText,
  Container,
  Header,
  Input,
  InputGroup,
  Title,
} from '../styles/Global'
import { useCircles } from '../contexts/circles'

export default function CreatePoint() {
  const [userCurrentLocation, setUserCurrentLocation] = useState<LatLng>()

  const [name, setName] = useState('')
  const [location, setLocation] = useState<LatLng | undefined>()
  const [radius, setRadius] = useState(200)

  const navigation = useNavigation()
  const { addNewCircle } = useCircles()

  useEffect(() => {
    async function getCurrentPosition() {
      const location = await Location.getCurrentPositionAsync()

      setUserCurrentLocation(location.coords)
    }

    getCurrentPosition()
  }, [])

  function handleCreateCircleInLocation(location: LatLng) {
    setLocation(location)
  }

  function handleAddNewCircle() {
    if (name && radius && location) {
      addNewCircle({
        name,
        radius,
        latlng: location,
      })

      navigation.navigate('Points' as never)
    } else {
      Alert.alert('Todos os valores precisam estar definidos!')
    }
  }

  return (
    <Container
      style={{
        padding: 24,
        paddingTop: 44,
      }}
    >
      <Header>
        <TouchableOpacity onPress={() => navigation.navigate('Map' as never)}>
          <Feather name="arrow-left" size={28} color="black" />
        </TouchableOpacity>
        <Title>Create</Title>
      </Header>
      <Input
        placeholder="Nome"
        onChangeText={value => {
          setName(value)
        }}
      />
      <Input
        placeholder="Raio do Circulo"
        keyboardType="number-pad"
        value={String(radius)}
        onChangeText={value => {
          setRadius(parseFloat(value))
        }}
      />
      {userCurrentLocation && (
        <MapView
          initialRegion={{
            latitude: userCurrentLocation.latitude,
            longitude: userCurrentLocation.longitude,
            latitudeDelta: 0.0012,
            longitudeDelta: 0.0121,
          }}
          style={{
            width: '100%',
            height: 320,
            marginTop: 8,
            borderRadius: 16,
            position: 'relative',
          }}
          onPress={event =>
            handleCreateCircleInLocation(event.nativeEvent.coordinate)
          }
        >
          {location !== undefined && (
            <Circle
              center={location}
              radius={radius}
              strokeWidth={1}
              strokeColor={'#1a66ff'}
              fillColor={'rgba(230,238,255,0.5)'}
            />
          )}
        </MapView>
      )}
      <InputGroup>
        {location === undefined ? (
          <></>
        ) : (
          <>
            <Input
              style={{ flex: 1 }}
              placeholder="Latitude"
              keyboardType="number-pad"
              value={String(location?.latitude)}
              editable={false}
            />
            <View style={{ width: 8 }} />
            <Input
              style={{ flex: 1 }}
              placeholder="Longitude"
              keyboardType="number-pad"
              value={String(location?.longitude)}
              editable={false}
            />
          </>
        )}
      </InputGroup>
      <Button onPress={handleAddNewCircle}>
        <ButtonText>Enviar</ButtonText>
      </Button>
    </Container>
  )
}
