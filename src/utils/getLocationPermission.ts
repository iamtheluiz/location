import * as Location from 'expo-location'

export async function getLocationPermission() {
  const { granted } = await Location.requestForegroundPermissionsAsync()

  return granted
}
