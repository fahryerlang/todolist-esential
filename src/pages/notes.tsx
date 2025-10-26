import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AddNoteForm from '@/components/AddNoteForm';
import NoteItem from '@/components/NoteItem';
import { Note } from '@/types/note';

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'important' | 'daily' | 'general'>('all');

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add note
  const handleAddNote = async (title: string, content: string, type: 'important' | 'daily' | 'general') => {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, type }),
    });

    if (response.ok) {
      const newNote = await response.json();
      setNotes([newNote, ...notes]);
    }
  };

  // Update note
  const handleUpdateNote = async (id: number, title: string, content: string, type: 'important' | 'daily' | 'general') => {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, type }),
    });

    if (response.ok) {
      const updatedNote = await response.json();
      setNotes(notes.map(note => note.id === id ? updatedNote : note));
    }
  };

  // Delete note
  const handleDeleteNote = async (id: number) => {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  // Filter notes
  const filteredNotes = notes.filter(note => {
    if (filter === 'all') return true;
    return note.type === filter;
  });

  const importantCount = notes.filter(n => n.type === 'important').length;
  const dailyCount = notes.filter(n => n.type === 'daily').length;
  const generalCount = notes.filter(n => n.type === 'general').length;

  return (
    <>
      <Head>
        <title>Catatan - Notes App</title>
        <meta name="description" content="Kelola catatan penting dan catatan harian Anda" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Catatan Saya
              </h1>
            </div>
            <p className="text-gray-600 mb-4">Kelola catatan penting dan catatan harian Anda</p>
            
            {/* Navigation */}
            <div className="flex justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke Todo List
              </Link>
            </div>
          </div>

          {/* Add Note Form */}
          <AddNoteForm onAdd={handleAddNote} />

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-purple-600">{notes.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-red-600">{importantCount}</div>
              <div className="text-sm text-gray-600">Penting</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{dailyCount}</div>
              <div className="text-sm text-gray-600">Harian</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{generalCount}</div>
              <div className="text-sm text-gray-600">Umum</div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-xl shadow-md p-2 border border-gray-100">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 min-w-[100px] py-2 px-4 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter('important')}
              className={`flex-1 min-w-[100px] py-2 px-4 rounded-lg font-medium transition-all ${
                filter === 'important'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Penting
            </button>
            <button
              onClick={() => setFilter('daily')}
              className={`flex-1 min-w-[100px] py-2 px-4 rounded-lg font-medium transition-all ${
                filter === 'daily'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Harian
            </button>
            <button
              onClick={() => setFilter('general')}
              className={`flex-1 min-w-[100px] py-2 px-4 rounded-lg font-medium transition-all ${
                filter === 'general'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Umum
            </button>
          </div>

          {/* Notes List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Memuat catatan...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-md border border-gray-100">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-lg">
                {filter === 'all' 
                  ? 'Belum ada catatan. Buat catatan pertama Anda!' 
                  : `Tidak ada catatan ${filter === 'important' ? 'penting' : filter === 'daily' ? 'harian' : 'umum'}!`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotes.map(note => (
                <NoteItem
                  key={note.id}
                  note={note}
                  onUpdate={handleUpdateNote}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
