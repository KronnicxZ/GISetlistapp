import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Card, CardTitle, CardSubtitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { COLORS, SPACING } from '../constants/theme';
import { mockSetlists, mockSongs } from '../mock/data';

const SetlistsScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const [setlists, setSetlists] = useState(mockSetlists);

  const getSongDetails = (songId) => {
    const song = mockSongs.find(s => s.id === songId);
    return song ? `${song.title} - ${song.artist}` : 'Canción no encontrada';
  };

  const renderSetlistItem = ({ item }) => (
    <Card
      isDarkMode={isDarkMode}
      variant="elevated"
      style={styles.setlistCard}
      onPress={() => navigation.navigate('SetlistDetail', { setlist: item })}
    >
      <CardTitle isDarkMode={isDarkMode}>{item.name}</CardTitle>
      <CardSubtitle isDarkMode={isDarkMode}>{item.date}</CardSubtitle>
      
      <View style={styles.songList}>
        {item.songs.slice(0, 3).map((songId) => (
          <CardSubtitle key={songId} isDarkMode={isDarkMode} style={styles.songItem}>
            • {getSongDetails(songId)}
          </CardSubtitle>
        ))}
        {item.songs.length > 3 && (
          <CardSubtitle isDarkMode={isDarkMode} style={styles.moreSongs}>
            • y {item.songs.length - 3} más...
          </CardSubtitle>
        )}
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? COLORS.background.dark : COLORS.background.light }]}>
      <View style={styles.header}>
        <Button
          title="Nuevo Setlist"
          onPress={() => navigation.navigate('SetlistDetail', { setlist: null })}
          variant="primary"
          size="medium"
        />
      </View>
      
      <FlatList
        data={setlists}
        renderItem={renderSetlistItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  list: {
    padding: SPACING.md,
  },
  setlistCard: {
    marginBottom: SPACING.md,
  },
  songList: {
    marginTop: SPACING.sm,
  },
  songItem: {
    marginBottom: SPACING.xs,
  },
  moreSongs: {
    fontStyle: 'italic',
  },
});

export default SetlistsScreen; 