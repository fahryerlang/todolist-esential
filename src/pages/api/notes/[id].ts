import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const noteId = parseInt(id as string);

  if (isNaN(noteId)) {
    return res.status(400).json({ error: 'Invalid note ID' });
  }

  if (req.method === 'GET') {
    try {
      const note = await prisma.note.findUnique({
        where: { id: noteId },
      });

      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      res.status(200).json(note);
    } catch (error) {
      console.error('Error fetching note:', error);
      res.status(500).json({ error: 'Failed to fetch note' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, content, type } = req.body;

      const note = await prisma.note.update({
        where: { id: noteId },
        data: {
          ...(title !== undefined && { title }),
          ...(content !== undefined && { content }),
          ...(type !== undefined && { type }),
        },
      });

      res.status(200).json(note);
    } catch (error) {
      console.error('Error updating note:', error);
      res.status(500).json({ error: 'Failed to update note' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.note.delete({
        where: { id: noteId },
      });

      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({ error: 'Failed to delete note' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
