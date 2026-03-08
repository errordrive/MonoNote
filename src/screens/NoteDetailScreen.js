import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getNoteById, deleteNote, togglePinNote } from '../database/noteModel';

const NoteDetailScreen = ({ navigation, route }) => {
  const [note, setNote] = useState(null);

  useEffect(() => {
    if (route.params?.noteId) {
      loadNote(route.params.noteId);
    }
  }, [route.params?.noteId]);

  const loadNote = async (id) => {
    try {
      const loadedNote = await getNoteById(id);
      setNote(loadedNote);
    } catch (error) {
      console.error('Error loading note:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteNote(note.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleTogglePin = async () => {
    await togglePinNote(note.id, !note.isPinned);
    loadNote(note.id);
  };

  const handleEdit = () => {
    navigation.navigate('CreateNote', { noteId: note.id });
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleTogglePin} style={styles.actionButton}>
            <Text style={styles.actionIcon}>{note.isPinned ? '📌' : '📍'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
            <Text style={styles.actionIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.date}>
          {new Date(note.updatedAt).toLocaleString()}
        </Text>
        <Text style={styles.noteContent}>{note.content}</Text>
      </ScrollView>
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  actionIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 24,
  },
  noteContent: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
});

export default NoteDetailScreen;
