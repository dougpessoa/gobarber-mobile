import React, { useCallback, useRef } from 'react';
import { 
  Image, 
  View, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  TextInput,
  Alert,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErros';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';

import { 
  Container, 
  Title,
  UserAvatarButton,
  UserAvatar,
  BackButton,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();

  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback( async (data: ProfileFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: (val) => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string(),
        }),
        password_confirmation: Yup.string()
          .when('old_password', {
            is: (val) => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          })
          .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta')

      })

      await schema.validate(data, {
        abortEarly: false,
      });

      const {
        name,
        email,
        old_password,
        password,
        password_confirmation
      } = data;

      const formData = {
        name,
        email,
        ...(old_password 
          ? {
              old_password,
              password,
              password_confirmation
            }
            : {}),
      }

      await api.put('/profile', formData);

      Alert.alert('Perfil atualizado com sucesso!');

      navigation.goBack();
    } catch (err) {
      if(err instanceof Yup.ValidationError){
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
      }

      Alert.alert(
        'Erro na atualização do perfil',
        'Ocorreu um erro ao atualizar perfil, tente novamente.'
      )
    }
  }, [navigation]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation.goBack]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1  }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flex: 1 }}
      >
      <Container>
        <BackButton onPress={handleGoBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <UserAvatarButton>
          <UserAvatar source={{ uri: 'https://avatars2.githubusercontent.com/u/60467733?s=460&u=201ffe69a61b97d75d703dbaac75b844d3d01f94&v=4' }} />
        </UserAvatarButton>

        <View>
          <Title>Meu perfil</Title>
        </View>
        <Form 
          initialData={user} 
          style={{ width: '100%' }} 
          ref={formRef} 
          onSubmit={handleSignUp}
        >
          <Input 
            name="name" 
            icon="user" 
            placeholder="Nome"
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => {
              emailInputRef.current?.focus()
            }}
          />
          
          <Input 
            ref={emailInputRef}
            name="email" 
            keyboardType="email-address"
            icon="mail" 
            placeholder="E-mail"
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => {
              oldPasswordInputRef.current?.focus()
            }}
          />

          <Input 
            ref={oldPasswordInputRef}
            name="old_password" 
            secureTextEntry
            icon="lock" 
            textContentType="newPassword"
            placeholder="Senha atual"
            returnKeyType="next"
            blurOnSubmit={false}
            containerStyle={{
              marginTop: 16
            }}
            onSubmitEditing={() => {
              passwordInputRef.current?.focus()
            }}
          />

          <Input 
            ref={passwordInputRef}
            name="password" 
            secureTextEntry
            icon="lock" 
            textContentType="newPassword"
            placeholder="Senha"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              confirmPasswordInputRef.current?.focus()
            }}
          />

          <Input 
            ref={confirmPasswordInputRef}
            name="confirmPassword" 
            secureTextEntry
            icon="lock" 
            textContentType="newPassword"
            placeholder="Confirmar senha"
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              formRef.current?.submitForm();
            }}
          />

          <Button
            onPress={() => {
              formRef.current?.submitForm();
              Keyboard.dismiss();
            }}
          >
            Confirmar mudanças
          </Button>
        </Form>

      </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Profile;