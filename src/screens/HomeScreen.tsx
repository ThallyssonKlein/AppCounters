import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCounters} from '../context/CountersContext';
import {Counter} from '../types/Counter';
import type {RootStackParamList} from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({navigation}: Props) {
  const {counters, increment, decrement, resetAll} = useCounters();

  const handleResetAll = () => {
    Alert.alert(
      'Resetar todos os contadores',
      'Tem certeza que deseja zerar todos os contadores?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {text: 'Resetar', style: 'destructive', onPress: resetAll},
      ],
    );
  };

  const renderItem = ({item}: {item: Counter}) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.decrementButton]}
          onPress={() => decrement(item.id)}>
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.value}>{item.value}</Text>
        <TouchableOpacity
          style={[styles.button, styles.incrementButton]}
          onPress={() => increment(item.id)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Contadores</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.settingsButtonText}>Configurar</Text>
        </TouchableOpacity>
      </View>
      {counters.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Nenhum contador ainda. Toque em "Configurar" para criar o
            primeiro.
          </Text>
        </View>
      ) : (
        <FlatList
          data={counters}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
      {counters.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetAll}>
            <Text style={styles.resetButtonText}>Resetar todos</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  settingsButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
  },
  settingsButtonText: {
    color: '#1C1C1E',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  resetButton: {
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#FFE5E5',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FF3B30',
    fontWeight: '700',
    fontSize: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decrementButton: {
    backgroundColor: '#FF3B30',
  },
  incrementButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    minWidth: 40,
    textAlign: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
