import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AddTodoForm from '@/components/AddTodoForm';
import TodoItem from '@/components/TodoItem';
import { Todo } from '@/types/todo';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add todo
  const handleAddTodo = async (title: string, description: string) => {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    if (response.ok) {
      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
    }
  };

  // Toggle todo completion
  const handleToggleTodo = async (id: number, completed: boolean) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });

    if (response.ok) {
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id: number) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  // Update todo
  const handleUpdateTodo = async (id: number, title: string, description: string) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    if (response.ok) {
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    }
  };

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <>
      <Head>
        <title>Todo List - Stay Organized</title>
        <meta name="description" content="A beautiful and simple todo list application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Todo List
              </h1>
            </div>
            <p className="text-gray-600 mb-4">Stay organized and productive</p>
            
            {/* Navigation */}
            <div className="flex justify-center gap-4">
              <Link
                href="/notes"
                className="inline-flex items-center gap-2 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Lihat Catatan
              </Link>
            </div>
          </div>

          {/* Add Todo Form */}
          <AddTodoForm onAdd={handleAddTodo} />

          {/* Stats */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{activeCount}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-purple-600">{todos.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6 bg-white rounded-xl shadow-md p-2 border border-gray-100">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                filter === 'active'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                filter === 'completed'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Todo List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading todos...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-md border border-gray-100">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 text-lg">
                {filter === 'all' ? 'No todos yet. Add one to get started!' :
                 filter === 'active' ? 'No active todos!' :
                 'No completed todos yet!'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onUpdate={handleUpdateTodo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
