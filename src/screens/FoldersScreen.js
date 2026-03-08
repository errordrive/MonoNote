import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllFolders, createFolder, deleteFolder } from '../database/folderModel';
import { getNotesByFolder } from '../database/noteModel';

const FoldersScreen = ({ navigation }) => {
  const [folders, setFolders] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const loadFolders = async () => {
    try {
      const allFolders = await getAllFolders();
      const foldersWithCount = await Promise.all(
        allFolders.map(async (folder) => {
          const notes = await getNotesByFolder(folder.id);
          return { ...folder, noteCount: notes.length };
        })
      );
      setFolders(foldersWithCount);
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFolders();
    }, [])
  );

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      Alert.alert('Error', 'Please enter a folder name');
      return;
    }

    try {
      await createFolder(newFolderName);
      setNewFolderName('');
      setShowInput(false);
      loadFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleDeleteFolder = (id, name) => {
    Alert.alert(
      'Delete Folder',
      `Delete "${name}"? Notes in this folder will be moved to "All Notes"`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteFolder(id);
            loadFolders();
          },
        },
      ]
    );
  };

  const renderFolder = ({ item }) => (
    <TouchableOpacity
      style={styles.folderCard}
      onPress={() => navigation.navigate('FolderNotes', { 
        folderId: item.id, 
        folderName: item.name 
      })}
      onLongPress={() => handleDeleteFolder(item.id, item.name)}
    >
      <Text style={styles.folderIcon}>📁</Text>
      <View style={styles.folderInfo}>
        <Text style={styles.folderName}>{item.name}</Text>
        <Text style={styles.folderCount}>{item.noteCount} notes</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Folders</Text>
        <TouchableOpacity onPress={() => setShowInput(!showInput)}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
      </View>

      {showInput && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New folder name"
            value={newFolderName}
            onChangeText={setNewFolderName}
            onSubmitEditing={handleCreateFolder}
            autoFocus
          />
          <TouchableOpacity onPress={handleCreateFolder} style={styles.createButton}>
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      )}

      {folders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📁</Text>
          <Text style={styles.emptyText}>No folders yet</Text>
          <Text style={styles.emptySubtext}>Tap + to create a folder</Text>
        </View>
      ) : (
        <FlatList
          data={folders}
          renderItem={renderFolder}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    fontSize: 24,
    color: '#000000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  addButton: {
    fontSize: 32,
    color: '#000000',
    fontWeight: '300',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  folderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  folderIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  folderInfo: {
    flex: 1,
  },
  folderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  folderCount: {
    fontSize: 14,
    color: '#999999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
  },
});

export default FoldersScreen;
