import styled from 'styled-components/native'
import MapView, { Circle } from 'react-native-maps'
import { Alert } from 'react-native'
import { NotificationArea, useCircles } from '../contexts/circles'
import { getDistanceFromLatLonInKm } from '../utils/getDistanceFromLatLonInKm'
import { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons'
import { MapStyle } from '../styles/MapStyle'
import { Button, ListItem } from '@ui-kitten/components'

const CirclesItemContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 280px;
  border: 2px solid #ccc;
  border-radius: 16px;
  margin-bottom: 16px;
`
const CirclesItemMap = styled.View`
  width: 100%;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  height: 180px;
  overflow: hidden;
`
const CirclesItemInfo = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 6px 12px;
  flex: 1;
  background-color: white;
`
const CirclesItemDetails = styled.View`
  flex: 1;
  justify-content: center;
`
const CirclesItemName = styled.Text`
  font-size: 20px;
  font-weight: bold;
`
const CirclesItemPosition = styled.Text``
const CirclesItemRadius = styled.Text``
const CirclesItemDistanceContainer = styled.View`
  justify-content: center;
  align-items: center;
`
const CirclesItemDistanceLabel = styled.Text``
const CirclesItemDistance = styled.Text`
  font-size: 20px;
  font-weight: bold;
`

export type CirclesItemDisplayType = 'list' | 'grid' | 'map'

export default function CirclesItem({
  circle,
  displayType,
}: {
  circle: NotificationArea
  displayType: CirclesItemDisplayType
}) {
  const { currentLocation } = useCircles()
  const [distanceText, setDistanceText] = useState('0km')
  const { isGettingCurrentLocation, removeCircle } = useCircles()

  useEffect(() => {
    let distanceValue = getDistanceFromLatLonInKm(
      circle.latlng.latitude,
      circle.latlng.longitude,
      currentLocation.latitude,
      currentLocation.longitude
    )
    let unit = ''

    if (distanceValue < 1) {
      // Convert to meters
      distanceValue = distanceValue * 1000
      distanceValue = Math.ceil(distanceValue * 100) / 100
      unit = 'm'
    } else {
      distanceValue = Math.ceil(distanceValue * 100) / 100
      unit = 'km'
    }

    setDistanceText(`${distanceValue}${unit}`)
  }, [currentLocation])

  function handleDeleteCircle() {
    Alert.alert(
      'Remover ponto',
      `Você tem certeza que deseja excluir o ponto ${circle.name}?`,
      [
        {
          text: 'Cancelar',
        },
        {
          text: 'Confirmar',
          onPress: () => removeCircle(circle.id),
        },
      ]
    )
  }

  if (displayType === 'list')
    return (
      <ListDisplay
        circle={circle}
        isGettingCurrentLocation={isGettingCurrentLocation}
        distanceText={distanceText}
        handleDeleteCircle={handleDeleteCircle}
      />
    )

  if (displayType === 'grid')
    return (
      <MapDisplay
        circle={circle}
        isGettingCurrentLocation={isGettingCurrentLocation}
        distanceText={distanceText}
        handleDeleteCircle={handleDeleteCircle}
      />
    )

  return (
    <MapDisplay
      circle={circle}
      isGettingCurrentLocation={isGettingCurrentLocation}
      distanceText={distanceText}
      handleDeleteCircle={handleDeleteCircle}
    />
  )
}

type DisplayProps = {
  circle: NotificationArea
  isGettingCurrentLocation: boolean
  distanceText: string
  handleDeleteCircle: () => void
}

const ListDisplay = ({
  circle,
  isGettingCurrentLocation,
  distanceText,
  handleDeleteCircle,
}: DisplayProps) => {
  return (
    <ListItem
      title={circle.name}
      description={
        isGettingCurrentLocation
          ? distanceText
          : `${circle.radius} metros de raio`
      }
      accessoryRight={
        <Button
          style={{ width: 38, height: 38, marginLeft: 4 }}
          status="danger"
          onPress={handleDeleteCircle}
          accessoryLeft={<Feather name="trash" size={18} color="white" />}
        />
      }
      style={{ backgroundColor: 'transparent' }}
    />
  )
}

const MapDisplay = ({
  circle,
  isGettingCurrentLocation,
  distanceText,
  handleDeleteCircle,
}: DisplayProps) => {
  return (
    <CirclesItemContainer>
      <CirclesItemMap>
        <MapView
          initialRegion={{
            latitude: circle.latlng.latitude,
            longitude: circle.latlng.longitude,
            latitudeDelta: 0.0012,
            longitudeDelta: 0.0121,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
          customMapStyle={MapStyle}
          pitchEnabled={false}
          rotateEnabled={false}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Circle
            key={circle.id}
            center={circle.latlng}
            radius={circle.radius}
            strokeWidth={1}
            strokeColor={'#1a66ff'}
            fillColor={'rgba(230,238,255,0.5)'}
          />
        </MapView>
      </CirclesItemMap>
      <CirclesItemInfo>
        <CirclesItemDetails>
          <CirclesItemName>{circle.name}</CirclesItemName>
          <CirclesItemPosition>
            {Math.ceil(circle.latlng.latitude * 10000) / 10000},
            {Math.ceil(circle.latlng.longitude * 10000) / 10000}
          </CirclesItemPosition>
          <CirclesItemRadius>{circle.radius} metros de raio</CirclesItemRadius>
        </CirclesItemDetails>
        {isGettingCurrentLocation && (
          <CirclesItemDistanceContainer>
            <CirclesItemDistanceLabel>Distância</CirclesItemDistanceLabel>
            <CirclesItemDistance>{distanceText}</CirclesItemDistance>
          </CirclesItemDistanceContainer>
        )}
        <Button
          style={{ width: 38, height: 38, marginLeft: 4 }}
          status="danger"
          onPress={handleDeleteCircle}
          accessoryLeft={<Feather name="trash" size={18} color="white" />}
        />
      </CirclesItemInfo>
    </CirclesItemContainer>
  )
}
