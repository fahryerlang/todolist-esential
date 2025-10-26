import { useState } from 'react';
import { Note } from '@/types/note';
import ConfirmModal from './ConfirmModal';
import SuccessNotification from './SuccessNotification';

interface NoteItemProps {
  note: Note;
  onUpdate: (id: number, title: string, content: string, type: 'important' | 'daily' | 'general') => void;
  onDelete: (id: number) => void;
}

export default function NoteItem({ note, onUpdate, onDelete }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [editType, setEditType] = useState(note.type);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessNotif, setShowSuccessNotif] = useState(false);

  const handleSave = () => {
    if (editTitle.trim() && editContent.trim()) {
      onUpdate(note.id, editTitle, editContent, editType);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditType(note.type);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    onDelete(note.id);
    setShowSuccessNotif(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'important':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'daily':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'important':
        return 'Penting';
      case 'daily':
        return 'Harian';
      default:
        return 'Umum';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getTypeColor(note.type)}`}>
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
          
          <select
            value={editType}
            onChange={(e) => setEditType(e.target.value as 'important' | 'daily' | 'general')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="general">Umum</option>
            <option value="daily">Catatan Harian</option>
            <option value="important">Penting</option>
          </select>

          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900 bg-white"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Simpan
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{note.title}</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(note.type)}`}>
                {getTypeLabel(note.type)}
              </span>
            </div>
          </div>

          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{note.content}</p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              {formatDate(note.createdAt)}
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Hapus Catatan?"
        message="Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        type="danger"
      />

      <SuccessNotification
        isOpen={showSuccessNotif}
        title="Berhasil!"
        message="Catatan berhasil dihapus."
        onClose={() => setShowSuccessNotif(false)}
      />
    </div>
  );
}
