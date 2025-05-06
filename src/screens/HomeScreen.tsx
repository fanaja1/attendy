import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View>
      <Text>Liste des classes (bient😎🎹☆*: .｡. o(≧▽≦)o .｡.:*bient😎🎹☆ôt)</Text>
      <Button title="Créer une classe" onPress={() => navigation.navigate('CreateClass')} />
    </View>
  );
}
