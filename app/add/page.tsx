'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Note {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notes')
      .then((res) => res.json())
      .then((data) => {
        setNotes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load notes', err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">SnapShare Feed</h1>
            <p className="text-sm text-gray-600 mt-1">AWS Serverless App (S3 + DynamoDB + Next.js)</p>
          </div>
          <Link
            href="/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            + Add New Note
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-12">Loading notes from DynamoDB...</p>
        ) : notes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 mb-4">No notes shared yet!</p>
            <Link
              href="/add"
              className="text-indigo-600 font-medium hover:underline"
            >
              Be the first to upload one &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div key={note.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                {note.imageUrl && (
                  <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                    <img
                      src={note.imageUrl}
                      alt={note.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{note.title}</h3>
                    <p className="text-sm text-gray-600 mt-2">{note.description}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                    Uploaded: {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}