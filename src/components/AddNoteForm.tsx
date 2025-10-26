import { useState } from 'react';

interface AddNoteFormProps {
  onAdd: (title: string, content: string, type: 'important' | 'daily' | 'general') => void;
}

export default function AddNoteForm({ onAdd }: AddNoteFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'important' | 'daily' | 'general'>('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim() && content.trim()) {
      onAdd(title, content, type);
      setTitle('');
      setContent('');
      setType('general');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
          Judul Catatan
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Masukkan judul catatan..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="type" className="block text-gray-700 font-semibold mb-2">
          Tipe Catatan
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as 'important' | 'daily' | 'general')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
        >
          <option value="general">Umum</option>
          <option value="daily">Catatan Harian</option>
          <option value="important">Penting</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">
          Isi Catatan
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tulis catatan Anda di sini..."
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 bg-white"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
      >
        Tambah Catatan
      </button>
    </form>
  );
}
