import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

function App() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      console.log('Fetching notes from:', `${API_BASE_URL}/notes`);
      const response = await axios.get(`${API_BASE_URL}/notes`);
      console.log('Response data:', response.data);
      
      // Ensure we always set an array
      if (Array.isArray(response.data)) {
        setNotes(response.data);
      } else {
        console.error('API response is not an array:', response.data);
        setNotes([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]); // Set empty array on error
      setLoading(false);
    }
  };

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentNote.title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      if (isEditing) {
        // Update existing note
        await axios.put(`${API_BASE_URL}/notes/${currentNote.id}`, {
          title: currentNote.title,
          content: currentNote.content
        });
      } else {
        // Create new note
        await axios.post(`${API_BASE_URL}/notes`, {
          title: currentNote.title,
          content: currentNote.content
        });
      }
      
      // Reset form and refresh notes
      setCurrentNote({ id: null, title: '', content: '' });
      setIsEditing(false);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Error saving note');
    }
  };

  // Handle edit button click
  const handleEdit = (note) => {
    setCurrentNote(note);
    setIsEditing(true);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`${API_BASE_URL}/notes/${id}`);
        fetchNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Error deleting note');
      }
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setCurrentNote({ id: null, title: '', content: '' });
    setIsEditing(false);
  };

  if (loading) {
    return <div className="loading">Loading notes...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 My Notes App</h1>
        <p>Built with Spring Boot + React + PostgreSQL</p>
      </header>

      <main className="app-main">
        {/* Note Form */}
        <div className="note-form-container">
          <h2>{isEditing ? 'Edit Note' : 'Create New Note'}</h2>
          <form onSubmit={handleSubmit} className="note-form">
            <input
              type="text"
              placeholder="Note title..."
              value={currentNote.title}
              onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
              className="note-input"
            />
            <textarea
              placeholder="Write your note here..."
              value={currentNote.content}
              onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
              className="note-textarea"
              rows="5"
            />
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Update Note' : 'Save Note'}
              </button>
              {isEditing && (
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Notes List */}
        <div className="notes-container">
          <h2>Your Notes ({Array.isArray(notes) ? notes.length : 0})</h2>
          {!Array.isArray(notes) || notes.length === 0 ? (
            <div className="no-notes">
              <p>No notes yet. Create your first note above!</p>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <div key={note.id} className="note-card">
                  <div className="note-header">
                    <h3>{note.title}</h3>
                    <div className="note-actions">
                      <button 
                        onClick={() => handleEdit(note)}
                        className="btn btn-edit"
                        title="Edit note"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(note.id)}
                        className="btn btn-delete"
                        title="Delete note"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="note-content">
                    <p>{note.content || 'No content'}</p>
                  </div>
                  <div className="note-meta">
                    <small>
                      Created: {new Date(note.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;