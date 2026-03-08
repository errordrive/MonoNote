import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

const SettingsScreen = ({ navigation }) => {
  const handleAbout = () => {
    Alert.alert(
      'About MonoNote',
      'MonoNote v1.0\n\nMinimal B&W Smart Notes\n\nA simple and elegant note-taking app built with React Native.',
      [{ text: 'OK' }]
    );
  };

  const handleExport = () => {
    Alert.alert(
      'Export Notes',
      'Export feature coming soon!',
      [{ text: 'OK' }]
    );
  };

  const handleBackup = () => {
    Alert.alert(
      'Backup',
      'Backup feature coming soon!',
      [{ text: 'OK' }]
    );
  };

  const renderSettingItem = (icon, title, onPress) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <Text style={styles.settingTitle}>{title}</Text>
      <Text style={styles.settingArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          {renderSettingItem('📤', 'Export Notes', handleExport)}
          {renderSettingItem('💾', 'Backup & Restore', handleBackup)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          {renderSettingItem('ℹ️', 'About MonoNote', handleAbout)}
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.copyright}>© 2026 MonoNote</Text>
        </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999999',
    marginBottom: 8,
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  settingArrow: {
    fontSize: 24,
    color: '#CCCCCC',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  version: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    color: '#CCCCCC',
  },
});

export default SettingsScreen;
