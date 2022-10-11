import { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { useNavigation } from '@react-navigation/native'
import { Alert, TouchableOpacity, View } from 'react-native'
import MapView, { Circle, LatLng } from 'react-native-maps'

import {
  ButtonText,
  Container,
  Header,
  InputGroup,
  Title,
} from '../styles/Global'
import { useCircles } from '../contexts/circles'
import { Layout, Text, Input, Button } from '@ui-kitten/components'

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
    <Layout
      style={{
        flex: 1,
        padding: 24,
        paddingTop: 54,
      }}
    >
      <Header>
        <TouchableOpacity onPress={() => navigation.navigate('Map' as never)}>
          <Feather name="arrow-left" size={28} color="black" />
        </TouchableOpacity>
        <Text category="h1">Create</Text>
      </Header>
      <Input
        label="Nome do Ponto"
        placeholder="Ex: Casa"
        onChangeText={value => {
          setName(value)
        }}
      />
      <Input
        style={{ marginTop: 6 }}
        label="Raio do Círculo (m)"
        placeholder="Ex: 200"
        keyboardType="number-pad"
        value={String(radius)}
        onChangeText={value => {
          if (value === '') {
            value = '1'
          }
          let valueNumber = parseFloat(value)
          valueNumber = valueNumber < 1 ? 1 : valueNumber
          setRadius(valueNumber)
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
      <InputGroup style={{ marginTop: 6 }}>
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
      <Button
        style={{ marginTop: 6 }}
        status="primary"
        onPress={handleAddNewCircle}
      >
        ENVIAR
      </Button>
    </Layout>
  )
}
