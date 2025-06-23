import React from 'react';
import { exercises } from '../exercisesData';
import JsTryEditor from '@/app/components/tryeditor/JsTryEditor';

interface ExerciseDetailPageProps {
  params: { id: string };
}

export default function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
  const exercise = exercises.find(ex => ex.id === params.id);
  if (!exercise) return <div>Tapşırıq tapılmadı.</div>;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: 12 }}>{exercise.title}</h1>
      <div style={{ color: '#444', marginBottom: 18 }}>{exercise.description}</div>
      <JsTryEditor />
    </div>
  );
} 