package com.example.notesapp.repository;

import com.example.notesapp.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    // JpaRepository provides all basic CRUD operations:
    // - findAll()
    // - findById(Long id)
    // - save(Note note)
    // - delete(Note note)
    // - deleteById(Long id)
}