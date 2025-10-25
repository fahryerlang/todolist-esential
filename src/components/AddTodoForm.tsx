import React, { useState } from 'react';

interface AddTodoFormProps {
  onAdd: (title: string, description: string) => Promise<void>;
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onAdd(title, description);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-3 text-lg text-gray-900 placeholder-gray-400 bg-white border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description (optional)"
            rows={2}
            className="w-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none transition-colors"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={!title.trim() || isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? 'Adding...' : 'Add Todo'}
        </button>
      </div>
    </form>
  );
}
