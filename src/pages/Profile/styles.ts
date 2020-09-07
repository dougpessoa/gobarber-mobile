import styled from 'styled-components/native';
import { getBottomSpace } from 'react-native-iphone-x-helper';

export const Container  = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 30px;
  position: relative;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0px;
`;

export const UserAvatarButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  margin-top: 64px;
  align-self: center;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 32px;
`;

export const ButtonExit = styled.TouchableOpacity`
  width: 100%;
  height: 60px;
  background: #a83434;
  border-radius: 10px;
  margin-top: 8px;

  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

export const ButtonExitText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #fff;
  font-size: 18px;
`;