import React, { useState, useEffect } from 'react';
import { Bell, X, FileText, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

interface Notification {
  id: string;
  type: 'dailyLog' | 'photo' | 'lesson' | 'task';
  author: string;
  action: string;
  details?: string; // Bloco, local, etc
  timestamp: Date;
  read: boolean;
}

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Listener para Diários de Obra
    const unsubscribeLogs = onSnapshot(
      query(collection(db, 'dailyLogs'), orderBy('createdAt', 'desc'), limit(5)),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            addNotification({
              id: change.doc.id,
              type: 'dailyLog',
              author: data.createdBy || 'Usuário',
              action: 'adicionou um Diário de Obra',
              details: data.team ? `Equipe: ${data.team}` : undefined,
              timestamp: data.createdAt?.toDate() || new Date(),
              read: false
            });
          }
        });
      }
    );

    // Listener para Fotos
    const unsubscribePhotos = onSnapshot(
      query(collection(db, 'photos'), orderBy('uploadedAt', 'desc'), limit(5)),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            addNotification({
              id: change.doc.id,
              type: 'photo',
              author: data.uploadedBy || 'Usuário',
              action: 'enviou uma foto',
              details: data.location || undefined,
              timestamp: data.uploadedAt?.toDate() || new Date(),
              read: false
            });
          }
        });
      }
    );

    // Listener para Lições Aprendidas
    const unsubscribeLessons = onSnapshot(
      query(collection(db, 'lessonsLearned'), orderBy('date', 'desc'), limit(5)),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            addNotification({
              id: change.doc.id,
              type: 'lesson',
              author: data.reportedBy || 'Usuário',
              action: 'registrou uma Lição Aprendida',
              details: data.category ? `Categoria: ${data.category}` : undefined,
              timestamp: data.createdAt?.toDate() || new Date(data.date),
              read: false
            });
          }
        });
      }
    );

    return () => {
      unsubscribeLogs();
      unsubscribePhotos();
      unsubscribeLessons();
    };
  }, []);

  const addNotification = (notification: Notification) => {
    // Evitar notificações duplicadas e muito antigas (últimos 5 minutos)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (notification.timestamp < fiveMinutesAgo) return;

    setNotifications(prev => {
      // Verificar se já existe
      if (prev.some(n => n.id === notification.id)) return prev;
      
      const newNotifications = [notification, ...prev].slice(0, 10);
      return newNotifications;
    });

    setUnreadCount(prev => prev + 1);

    // Notificação do navegador (se permitido)
    if (Notification.permission === 'granted') {
      new Notification('Gran Garden Resort', {
        body: `${notification.author} ${notification.action}`,
        icon: '/icon-192x192.png'
      });
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'dailyLog': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'photo': return <Image className="w-5 h-5 text-green-600" />;
      case 'lesson': return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default: return <CheckCircle className="w-5 h-5 text-slate-600" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  // Solicitar permissão para notificações do navegador
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="relative">
      {/* Botão do Sino */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) markAllAsRead();
        }}
        className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Painel de Notificações */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-bold text-slate-800">Notificações</h3>
              {unreadCount > 0 && (
                <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                  {unreadCount} novas
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Lista de Notificações */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Nenhuma notificação</p>
                <p className="text-slate-400 text-sm mt-1">
                  Você será notificado quando houver atualizações
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800">
                        <span className="font-semibold text-blue-600">
                          {notification.author}
                        </span>{' '}
                        {notification.action}
                      </p>
                      {notification.details && (
                        <p className="text-xs text-slate-600 mt-1 font-medium">
                          📍 {notification.details}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-200 bg-slate-50">
              <button
                onClick={markAllAsRead}
                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Marcar todas como lidas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
