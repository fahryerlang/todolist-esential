import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      // Get all todos
      const todos = await prisma.todo.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      return res.status(200).json(todos);
    } else if (req.method === 'POST') {
      // Create new todo
      const { title, description } = req.body;

      if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
      }

      const todo = await prisma.todo.create({
        data: {
          title: title.trim(),
          description: description?.trim() || null,
        },
      });

      return res.status(201).json(todo);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
