import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useCounters} from '../context/CountersContext';
import {Counter} from '../types/Counter';

export default function SettingsScreen() {
  const {counters, addCounter, removeCounter, renameCounter} = useCounters();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      return;
    }
    addCounter(trimmed);
    setNewName('');
  };

  const handleStartEdit = (counter: Counter) => {
    setEditingId(counter.id);
    setEditingName(counter.name);
  };

  const handleConfirmEdit = () => {
    const trimmed = editingName.trim();
    if (editingId && trimmed) {
      renameCounter(editingId, trimmed);
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = (counter: Counter) => {
    Alert.alert(
      'Delete counter',
      `Are you sure you want to delete "${counter.name}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeCounter(counter.id),
        },
      ],
    );
  };

  const renderItem = ({item}: {item: Counter}) => {
    const isEditing = editingId === item.id;
    return (
      <View style={styles.row}>
        {isEditing ? (
          <TextInput
            style={styles.editInput}
            value={editingName}
            onChangeText={setEditingName}
            onSubmitEditing={handleConfirmEdit}
            onBlur={handleConfirmEdit}
            autoFocus
          />
        ) : (
          <Text style={styles.rowName}>{item.name}</Text>
        )}
        <View style={styles.rowActions}>
          {isEditing ? (
            <TouchableOpacity
              style={styles.smallButton}
              onPress={handleConfirmEdit}>
              <Text style={styles.smallButtonText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => handleStartEdit(item)}>
              <Text style={styles.smallButtonText}>Rename</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.smallButton, styles.deleteButton]}
            onPress={() => handleDelete(item)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Configure Counters</Text>

        <View style={styles.addRow}>
          <TextInput
            style={styles.addInput}
            placeholder="Counter name (e.g. Glasses of water)"
            value={newName}
            onChangeText={setNewName}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {counters.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              You haven't created any counters yet.
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
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  addRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  addInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  list: {
    paddingBottom: 24,
  },
  row: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  rowName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  editInput: {
    fontSize: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
    marginBottom: 10,
    paddingVertical: 4,
  },
  rowActions: {
    flexDirection: 'row',
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
    marginRight: 8,
  },
  smallButtonText: {
    color: '#1C1C1E',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FFE5E5',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
