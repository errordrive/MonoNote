import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useStorage } from '../database/StorageContext';

const SearchScreen = ({ navigation }) => {
  const storage = useStorage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (text) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchResults = storage.searchNotes(text);
    setResults(searchResults);
  };

  const renderNote = ({ item }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => navigation.navigate('NoteDetail', { noteId: item.id })}
    >
      <Text style={styles.noteTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.noteContent} numberOfLines={2}>
        {item.content}
      </Text>
      <Text style={styles.noteDate}>
        {new Date(item.updatedAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          placeholderTextColor="#999999"
          value={query}
          onChangeText={handleSearch}
          autoFocus
        />
      </View>

      {query.trim().length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>Search your notes</Text>
          <Text style={styles.emptySubtext}>Enter at least 2 characters</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>❌</Text>
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubtext}>Try a different search term</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderNote}
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    fontSize: 24,
    color: '#000000',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#000000',
    paddingVertical: 8,
  },
  listContent: {
    padding: 16,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  noteDate: {
    fontSize: 12,
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

export default SearchScreen;
