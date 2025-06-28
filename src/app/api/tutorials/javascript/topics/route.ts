import { NextResponse } from 'next/server';

export async function GET() {
  const topics = [
    { id: 'variables', title: 'Dəyişənlər', icon: 'FiCode', description: 'JavaScript-də dəyişənlərin əsasları.' },
    { id: 'functions', title: 'Funksiyalar', icon: 'FiPlay', description: 'Funksiya yazmaq və istifadə etmək.' },
    { id: 'arrays', title: 'Massivlər', icon: 'FiGrid', description: 'Massivlər və onların metodları.' },
    { id: 'objects', title: 'Obyektlər', icon: 'FiBox', description: 'Obyekt strukturu və istifadəsi.' },
    { id: 'loops', title: 'Dövr operatorları', icon: 'FiRefreshCw', description: 'for, while və digər dövrlər.' },
    { id: 'conditions', title: 'Şərtlər', icon: 'FiHelpCircle', description: 'if, else və switch.' },
    { id: 'strings', title: 'Sətirlər', icon: 'FiType', description: 'String-lərlə işləmək.' },
    { id: 'numbers', title: 'Rəqəmlər', icon: 'FiHash', description: 'Əsas ədədi əməliyyatlar.' },
    { id: 'dom', title: 'DOM ilə iş', icon: 'FiCpu', description: 'Sənəd obyekt modeli.' },
    { id: 'events', title: 'Hadisələr', icon: 'FiZap', description: 'Event-lərlə işləmək.' },
    { id: 'es6', title: 'ES6+ Xüsusiyyətləri', icon: 'FiStar', description: 'Yeni sintaksis və imkanlar.' },
    { id: 'modules', title: 'Modullar', icon: 'FiPackage', description: 'Kodun bölünməsi və import/export.' },
    { id: 'promises', title: 'Promises & Async', icon: 'FiClock', description: 'Asinxron proqramlaşdırma.' },
    { id: 'errors', title: 'Xətalar və Try/Catch', icon: 'FiAlertCircle', description: 'Error handling.' },
    { id: 'json', title: 'JSON', icon: 'FiFileText', description: 'JSON ilə işləmək.' },
    { id: 'bestpractices', title: 'Yaxşı Praktikalar', icon: 'FiThumbsUp', description: 'Kod yazmaq üçün tövsiyələr.' },
  ];
  return NextResponse.json(topics);
} 