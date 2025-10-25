import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // Validate ID
  const todoId = parseInt(id as string);
  if (isNaN(todoId)) {
    return res.status(400).json({ error: 'Invalid todo ID' });
  }

  try {
    if (req.method === 'PUT') {
      // Update todo
      const { title, description, completed } = req.body;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description?.trim() || null;
      if (completed !== undefined) updateData.completed = completed;

      const todo = await prisma.todo.update({
        where: { id: todoId },
        data: updateData,
      });

      return res.status(200).json(todo);
    } else if (req.method === 'DELETE') {
      // Delete todo
      await prisma.todo.delete({
        where: { id: todoId },
      });

      return res.status(200).json({ message: 'Todo deleted successfully' });
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}
