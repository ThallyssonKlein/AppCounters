import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCounters} from '../context/CountersContext';
import {Counter} from '../types/Counter';
import type {RootStackParamList} from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type Page = {kind: 'counter'; counter: Counter} | {kind: 'actions'};

/**
 * Compact home screen for Wear OS: one counter per horizontal page, sized to
 * fit inside a round display, plus a final page with the global actions.
 */
export default function WatchHomeScreen({navigation}: Props) {
  const {counters, increment, decrement, resetAll} = useCounters();
  const {width, height} = useWindowDimensions();
  const [pageIndex, setPageIndex] = useState(0);

  // Keep content inside the inscribed square of a round screen.
  const inset = Math.round(width * 0.15);

  const pages: Page[] = [
    ...counters.map(counter => ({kind: 'counter' as const, counter})),
    {kind: 'actions'},
  ];

  const handleResetAll = () => {
    Alert.alert('Reset all?', 'All counters go back to 0.', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Reset', style: 'destructive', onPress: resetAll},
    ]);
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setPageIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const renderCounter = (counter: Counter) => (
    <>
      <Text style={styles.name} numberOfLines={2}>
        {counter.name}
      </Text>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {counter.value}
      </Text>
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.decrementButton]}
          onPress={() => decrement(counter.id)}>
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.incrementButton]}
          onPress={() => increment(counter.id)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderActions = () => (
    <>
      {counters.length === 0 && (
        <Text style={styles.emptyText}>No counters yet</Text>
      )}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.actionText}>Configure</Text>
      </TouchableOpacity>
      {counters.length > 0 && (
        <TouchableOpacity
          style={[styles.actionButton, styles.resetButton]}
          onPress={handleResetAll}>
          <Text style={[styles.actionText, styles.resetText]}>Reset all</Text>
        </TouchableOpacity>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={pages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        keyExtractor={item =>
          item.kind === 'counter' ? item.counter.id : '__actions__'
        }
        renderItem={({item}) => (
          <View style={[styles.page, {width, height, padding: inset}]}>
            {item.kind === 'counter'
              ? renderCounter(item.counter)
              : renderActions()}
          </View>
        )}
      />
      {pages.length > 1 && (
        <View style={[styles.dots, {bottom: Math.round(height * 0.06)}]}>
          {pages.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === pageIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EBEBF0',
    textAlign: 'center',
  },
  value: {
    fontSize: 44,
    fontWeight: '700',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 28,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 10,
  },
  actionButton: {
    alignSelf: 'stretch',
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    marginVertical: 4,
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  resetButton: {
    backgroundColor: '#3A1210',
  },
  resetText: {
    color: '#FF6961',
  },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#48484A',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
  },
});
