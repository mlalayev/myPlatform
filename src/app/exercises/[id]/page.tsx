"use client";
import React, { useState } from 'react';
import { use } from 'react'; // <-- Əlavə et
import { exercises } from '../exercisesData';
import JsTryEditor from '@/app/components/tryeditor/JsTryEditor';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import styles from '../ExercisesList.module.css';

interface ExerciseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { id } = use(params);
  const exercise = exercises.find(ex => ex.id === id);
  if (!exercise) return <div>Tapşırıq tapılmadı.</div>;

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);

  return (
    <>
      <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
      <div className={styles.layout}>
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <div className={isSidebarOpen ? styles.contentOpen : styles.contentClosed}>
          <div style={{ margin: '0 auto', padding: 24 }}>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: 12 }}>{exercise.title}</h1>
            <div style={{ color: '#444', marginBottom: 18 }}>{exercise.description}</div>
            <JsTryEditor  />
          </div>
        </div>
      </div>
    </>
  );
} 