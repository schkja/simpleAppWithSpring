package com.example.notesapp.controller;

import com.example.notesapp.model.Note;
import com.example.notesapp.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:3000")
public class NoteController {
    
    @Autowired
    private NoteRepository noteRepository;
    
    // GET all notes
    @GetMapping
    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }
    
    // GET note by ID
    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        Optional<Note> note = noteRepository.findById(id);
        return note.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    // POST create new note
    @PostMapping
    public Note createNote(@RequestBody Note note) {
        return noteRepository.save(note);
    }
    
    // PUT update note
    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note noteDetails) {
        Optional<Note> optionalNote = noteRepository.findById(id);
        
        if (optionalNote.isPresent()) {
            Note note = optionalNote.get();
            note.setTitle(noteDetails.getTitle());
            note.setContent(noteDetails.getContent());
            return ResponseEntity.ok(noteRepository.save(note));
        }
        
        return ResponseEntity.notFound().build();
    }
    
    // DELETE note
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id) {
        return noteRepository.findById(id)
                .map(note -> {
                    noteRepository.delete(note);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}