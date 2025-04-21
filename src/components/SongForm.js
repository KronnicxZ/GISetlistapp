import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Box, Button, TextField, Typography, Container, Grid } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const SongForm = () => {
  const [songName, setSongName] = useState('');
  const [songList, setSongList] = useState([]);
  const [editingSong, setEditingSong] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('position');
      
      if (error) throw error;
      setSongList(data || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!songName.trim()) return;

    try {
      if (isEditing && editingSong) {
        const { error } = await supabase
          .from('songs')
          .update({ name: songName })
          .eq('id', editingSong.id);

        if (error) throw error;
      } else {
        const position = songList.length;
        const { error } = await supabase
          .from('songs')
          .insert([{ name: songName, position }]);

        if (error) throw error;
      }

      setSongName('');
      setIsEditing(false);
      setEditingSong(null);
      fetchSongs();
    } catch (error) {
      console.error('Error saving song:', error);
    }
  };

  const handleEdit = (song) => {
    setEditingSong(song);
    setSongName(song.name);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchSongs();
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(songList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSongList(items);

    // Update positions in database
    try {
      const updates = items.map((song, index) => ({
        id: song.id,
        position: index,
      }));

      const { error } = await supabase
        .from('songs')
        .upsert(updates);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating positions:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Song List Manager
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <TextField
                fullWidth
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
                placeholder="Enter song name"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                sx={{ height: '100%' }}
              >
                {isEditing ? 'Update' : 'Add'}
              </Button>
            </Grid>
          </Grid>
        </form>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="songs">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{ mt: 4 }}
              >
                {songList.map((song, index) => (
                  <Draggable
                    key={song.id}
                    draggableId={song.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          p: 2,
                          mb: 2,
                          bgcolor: 'background.paper',
                          borderRadius: 1,
                          boxShadow: 1,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography>{song.name}</Typography>
                        <Box>
                          <Button
                            onClick={() => handleEdit(song)}
                            color="primary"
                            size="small"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(song.id)}
                            color="error"
                            size="small"
                          >
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </Container>
  );
};

export default SongForm;

// DONE