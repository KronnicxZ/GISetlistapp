import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Card, CardTitle, CardSubtitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { COLORS, SPACING } from '../constants/theme';
import { mockSongs } from '../mock/data';
import { Ionicons } from '@expo/vector-icons';

const SongSelectorScreen = ({ route, navigation }) => {
  const { isDarkMode } = useTheme();
  const { selectedSongs: initialSelectedSongs, onSelect } = route.params;
  const [selectedSongs, setSelectedSongs] = useState(initialSelectedSongs || []);
  const [songs] = useState(mockSongs);

  const toggleSongSelection = (songId) => {
    setSelectedSongs(prev => {
      if (prev.includes(songId)) {
        return prev.filter(id => id !== songId);
      } else {
        return [...prev, songId];
      }
    });
  };

  const handleSave = () => {
    onSelect(selectedSongs);
    navigation.goBack();
  };

  const renderSongItem = ({ item }) => {
    const isSelected = selectedSongs.includes(item.id);
    
    return (
      <TouchableOpacity
        onPress={() => toggleSongSelection(item.id)}
        style={[
          styles.songItem,
          isSelected && styles.selectedSongItem,
        ]}
      >
        <View style={styles.songInfo}>
          <CardTitle isDarkMode={isDarkMode}>{item.title}</CardTitle>
          <CardSubtitle isDarkMode={isDarkMode}>
            {item.artist} • {item.bpm} BPM • {item.key}
          </CardSubtitle>
        </View>
        
        <View style={styles.checkbox}>
          {isSelected ? (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          ) : (
            <Ionicons
              name="ellipse-outline"
              size={24}
              color={isDarkMode ? COLORS.gray.dark : COLORS.gray.light}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? COLORS.background.dark : COLORS.background.light }]}>
      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.footer}>
        <Button
          title={`Seleccionar (${selectedSongs.length})`}
          onPress={handleSave}
          variant="primary"
          size="large"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: SPACING.md,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 8,
    backgroundColor: COLORS.background.light,
    borderWidth: 1,
    borderColor: COLORS.gray.light,
  },
  selectedSongItem: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  songInfo: {
    flex: 1,
  },
  checkbox: {
    marginLeft: SPACING.md,
  },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray.light,
  },
  button: {
    width: '100%',
  },
});

export default SongSelectorScreen; 