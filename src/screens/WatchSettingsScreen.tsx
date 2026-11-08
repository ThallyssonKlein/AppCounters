import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCounters} from '../context/CountersContext';
import {Counter} from '../types/Counter';
import type {RootStackParamList} from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

/**
 * Compact counter management for Wear OS: a single vertical scroll that keeps
 * its content inside a round display. Tap a name to rename it.
 */
export default function WatchSettingsScreen({navigation}: Props) {
  const {counters, addCounter, removeCounter, renameCounter} = useCounters();
  const {width} = useWindowDimensions();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const inset = Math.round(width * 0.15);

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (trimmed) {
      addCounter(trimmed);
      setNewName('');
    }
  };

  const handleConfirmEdit = () => {
    const trimmed = editingName.trim();
    if (editingId && trimmed) {
      renameCounter(editingId, trimmed);
    }
    setEditingId(null);
  };

  const handleDelete = (counter: Counter) => {
    Alert.alert('Delete?', `"${counter.name}" will be removed.`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeCounter(counter.id),
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingHorizontal: inset, paddingVertical: inset}}
      keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Counters</Text>

      <TextInput
        style={styles.input}
        placeholder="New counter"
        placeholderTextColor="#8E8E93"
        value={newName}
        onChangeText={setNewName}
        onSubmitEditing={handleAdd}
        returnKeyType="done"
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>

      {counters.map(counter => (
        <View key={counter.id} style={styles.row}>
          {editingId === counter.id ? (
            <TextInput
              style={[styles.rowName, styles.editInput]}
              value={editingName}
              onChangeText={setEditingName}
              onSubmitEditing={handleConfirmEdit}
              onBlur={handleConfirmEdit}
              autoFocus
            />
          ) : (
            <TouchableOpacity
              style={styles.rowNameTouch}
              onPress={() => {
                setEditingId(counter.id);
                setEditingName(counter.name);
              }}>
              <Text style={styles.rowName} numberOfLines={1}>
                {counter.name}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(counter)}>
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1C1C1E',
    color: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 18,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 18,
    paddingLeft: 14,
    marginBottom: 6,
  },
  rowNameTouch: {
    flex: 1,
    paddingVertical: 8,
  },
  rowName: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  editInput: {
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#0A84FF',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  deleteText: {
    color: '#FF6961',
    fontSize: 14,
    fontWeight: '700',
  },
  doneButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 18,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  doneText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
