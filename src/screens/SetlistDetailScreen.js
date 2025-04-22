import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Card, CardTitle, CardSubtitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { mockSongs } from '../mock/data';
import { Ionicons } from '@expo/vector-icons';

const SetlistDetailScreen = ({ route, navigation }) => {
  const { isDarkMode } = useTheme();
  const { setlist: initialSetlist } = route.params;
  const [setlist, setSetlist] = useState(initialSetlist || {
    name: '',
    date: new Date().toISOString().split('T')[0],
    songs: [],
  });

  const handleSave = () => {
    if (!setlist.name.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    // Aquí iría la lógica para guardar el setlist
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Setlist',
      '¿Estás seguro de que deseas eliminar este setlist?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            // Aquí iría la lógica para eliminar el setlist
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleAddSong = () => {
    navigation.navigate('SongSelector', {
      selectedSongs: setlist.songs,
      onSelect: (selectedSongs) => {
        setSetlist({ ...setlist, songs: selectedSongs });
      },
    });
  };

  const handleRemoveSong = (songId) => {
    setSetlist({
      ...setlist,
      songs: setlist.songs.filter(id => id !== songId),
    });
  };

  const getSongDetails = (songId) => {
    return mockSongs.find(s => s.id === songId);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDarkMode ? COLORS.background.dark : COLORS.background.light }]}
      contentContainerStyle={styles.content}
    >
      <Card isDarkMode={isDarkMode} style={styles.card}>
        <TextInput
          style={[
            styles.input,
            { color: isDarkMode ? COLORS.text.dark : COLORS.text.light },
          ]}
          placeholder="Nombre del Setlist"
          placeholderTextColor={isDarkMode ? COLORS.gray.dark : COLORS.gray.light}
          value={setlist.name}
          onChangeText={(text) => setSetlist({ ...setlist, name: text })}
        />
        
        <TextInput
          style={[
            styles.input,
            { color: isDarkMode ? COLORS.text.dark : COLORS.text.light },
          ]}
          placeholder="Fecha"
          placeholderTextColor={isDarkMode ? COLORS.gray.dark : COLORS.gray.light}
          value={setlist.date}
          onChangeText={(text) => setSetlist({ ...setlist, date: text })}
        />
      </Card>
      
      <Card isDarkMode={isDarkMode} style={styles.card}>
        <CardTitle isDarkMode={isDarkMode}>Canciones</CardTitle>
        
        {setlist.songs.map((songId) => {
          const song = getSongDetails(songId);
          if (!song) return null;
          
          return (
            <View key={songId} style={styles.songItem}>
              <View style={styles.songInfo}>
                <CardSubtitle isDarkMode={isDarkMode}>{song.title}</CardSubtitle>
                <CardSubtitle isDarkMode={isDarkMode} style={styles.songDetails}>
                  {song.artist} • {song.bpm} BPM • {song.key}
                </CardSubtitle>
              </View>
              
              <TouchableOpacity
                onPress={() => handleRemoveSong(songId)}
                style={styles.removeButton}
              >
                <Ionicons
                  name="close-circle"
                  size={24}
                  color={isDarkMode ? COLORS.gray.dark : COLORS.gray.light}
                />
              </TouchableOpacity>
            </View>
          );
        })}
        
        <Button
          title="Agregar Canciones"
          onPress={handleAddSong}
          variant="secondary"
          size="medium"
          style={styles.addButton}
        />
      </Card>
      
      <View style={styles.buttons}>
        <Button
          title="Guardar"
          onPress={handleSave}
          variant="primary"
          size="large"
          style={styles.button}
        />
        
        {initialSetlist && (
          <Button
            title="Eliminar"
            onPress={handleDelete}
            variant="secondary"
            size="large"
            style={styles.button}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  input: {
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING.md,
    padding: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray.light,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray.light,
  },
  songInfo: {
    flex: 1,
  },
  songDetails: {
    fontSize: FONT_SIZES.sm,
  },
  removeButton: {
    padding: SPACING.xs,
  },
  addButton: {
    marginTop: SPACING.md,
  },
  buttons: {
    gap: SPACING.md,
  },
  button: {
    width: '100%',
  },
});

export default SetlistDetailScreen; 