import { useEffect, useState } from 'react'
import MapView, { Circle } from 'react-native-maps'
import * as Location from 'expo-location'
import { Text } from 'react-native'

import { Feather, MaterialIcons } from '@expo/vector-icons'
import { Container, FloatButton, OverView } from '../styles/Global'
import { NotificationArea, useCircles } from '../contexts/circles'
import { useNavigation } from '@react-navigation/core'
import { MapStyle } from '../styles/MapStyle'

export default function Map() {
  const [granted, setGranted] = useState(false)
  const [location, setLocation] = useState<Location.LocationObject>()

  const {
    circles,
    setCircles,
    handleToggleLocation,
    isGettingCurrentLocation,
  } = useCircles()
  const navigation = useNavigation()

  useEffect(() => {
    // Request location permission
    async function getLocationPermission() {
      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== 'granted') {
        return
      }

      setGranted(true)
      const location = await Location.getCurrentPositionAsync()
      setLocation(location)
    }

    getLocationPermission()
  }, [])

  function handleRemoveCircle(circle: NotificationArea) {
    setCircles(circles!.filter(item => item.id === circle.id))
  }

  function checkIfLocationIsInsideCircle() {}

  if (granted === false || !location) {
    return (
      <Container center={false}>
        <Text>Location permission needed!</Text>
      </Container>
    )
  }

  return (
    <Container>
      <MapView
        initialRegion={{
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
        showsUserLocation
        followsUserLocation
        onUserLocationChange={checkIfLocationIsInsideCircle}
        userInterfaceStyle={'dark'}
        customMapStyle={MapStyle}
        showsMyLocationButton={false}
        onLongPress={event =>
          navigation.navigate(
            'CreatePoint' as never,
            event.nativeEvent.coordinate as never
          )
        }
      >
        {circles!.map(circle => (
          <Circle
            key={circle.id}
            center={circle.latlng}
            radius={circle.radius}
            strokeWidth={1}
            strokeColor={'#1a66ff'}
            fillColor={'rgba(230,238,255,0.5)'}
            onPress={() => handleRemoveCircle(circle)}
          />
        ))}
      </MapView>
      <OverView>
        <FloatButton onPress={handleToggleLocation}>
          {!isGettingCurrentLocation ? (
            <MaterialIcons name="gps-off" size={28} color="white" />
          ) : (
            <MaterialIcons name="gps-fixed" size={28} color="white" />
          )}
        </FloatButton>
        <FloatButton onPress={() => navigation.navigate('Points' as never)}>
          <Feather name="list" size={28} color="white" />
        </FloatButton>
        <FloatButton
          style={{ backgroundColor: '#f22d0a' }}
          onPress={() => navigation.navigate('CreatePoint' as never)}
        >
          <Feather name="plus" size={28} color="white" />
        </FloatButton>
      </OverView>
    </Container>
  )
}
