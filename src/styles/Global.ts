import styled from 'styled-components/native'

interface ContainerProps {
  center?: boolean
}
export const Container = styled.View<ContainerProps>`
  flex: 1;
  background-color: #fff;
  ${props =>
    props.center &&
    `align-items: center;
    justify-content: center;
    `};
  position: relative;
`
export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`
export const Title = styled.Text`
  font-size: 36px;
  font-weight: bold;
  margin-left: 8px;
`

export const FloatButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;

  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: #334e58;
  margin-top: 8px;
`

export const OverView = styled.View`
  flex: 1;
  align-items: flex-end;
  justify-content: flex-end;
  position: absolute;

  width: 100%;
  height: 100%;
  padding: 16px;
`
