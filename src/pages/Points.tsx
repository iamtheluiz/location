import { useState, Fragment } from 'react'
import { ScrollView, TouchableOpacity, View, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { Feather } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { MenuItem, OverflowMenu, Text } from '@ui-kitten/components'
import CirclesItem, { CirclesItemDisplayType } from '../components/CirclesItem'

import { Container, Header } from '../styles/Global'

import { useCircles } from '../contexts/circles'

export default function Points() {
  const { circles } = useCircles()
  const [menuVisible, setMenuVisible] = useState(false)
  const [displayType, setDisplayType] = useState<CirclesItemDisplayType>('list')

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  function handleSelectDisplayType(displayType: CirclesItemDisplayType) {
    setDisplayType(displayType)
    setMenuVisible(false)
  }

  const navigation = useNavigation()

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
        contentContainerStyle={{
          paddingBottom: 46,
        }}
      >
        <Header>
          <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Map' as never)}
            >
              <Feather name="arrow-left" size={28} color="white" />
            </TouchableOpacity>
            <Text category="h1" style={{ color: 'white' }}>
              Pontos
            </Text>
          </View>
          <OverflowMenu
            anchor={() => (
              <TouchableOpacity onPress={toggleMenu}>
                <MaterialIcons name="view-list" size={24} color="white" />
              </TouchableOpacity>
            )}
            visible={menuVisible}
            onBackdropPress={toggleMenu}
          >
            <MenuItem
              accessoryLeft={props => (
                <MaterialIcons
                  {...props}
                  name="view-agenda"
                  size={24}
                  color="white"
                />
              )}
              title="Lista"
              onPress={() => handleSelectDisplayType('list')}
            />
            <MenuItem
              accessoryLeft={props => (
                <MaterialCommunityIcons
                  {...props}
                  name="view-grid"
                  size={24}
                  color="white"
                />
              )}
              title="Malha"
              onPress={() => handleSelectDisplayType('grid')}
            />
            <MenuItem
              accessoryLeft={props => (
                <MaterialIcons
                  {...props}
                  name="view-agenda"
                  size={24}
                  color="white"
                />
              )}
              title="Mapa"
              onPress={() => handleSelectDisplayType('map')}
            />
          </OverflowMenu>
        </Header>
        {!circles && <></>}
        {circles!.length === 0 && (
          <Text category="h6" style={{ color: 'white' }}>
            Não existem pontos cadastros!
          </Text>
        )}
        {circles!.map(circle => (
          <CirclesItem
            key={circle.id}
            circle={circle}
            displayType={displayType}
          />
        ))}
      </ScrollView>
    </Container>
  )
}
