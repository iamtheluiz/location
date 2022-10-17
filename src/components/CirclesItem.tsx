import styled from 'styled-components/native'
import MapView, { Circle } from 'react-native-maps'
import { NotificationArea, useCircles } from '../contexts/circles'
import { getDistanceFromLatLonInKm } from '../utils/getDistanceFromLatLonInKm'
import { useEffect, useState } from 'react'
import { MapStyle } from '../styles/MapStyle'

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

export default function CirclesItem({ circle }: { circle: NotificationArea }) {
  const { currentLocation } = useCircles()
  const [distanceText, setDistanceText] = useState('0km')

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
        <CirclesItemDistanceContainer>
          <CirclesItemDistanceLabel>Distância</CirclesItemDistanceLabel>
          <CirclesItemDistance>{distanceText}</CirclesItemDistance>
        </CirclesItemDistanceContainer>
      </CirclesItemInfo>
    </CirclesItemContainer>
  )
}