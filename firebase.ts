// Firebase Local - Substituto temporário usando LocalStorage
// Quando conseguir acesso ao Firebase, use o firebase.ts original

interface LocalStorageDB {
  dailyLogs: any[];
  photos: any[];
  lessonsLearned: any[];
}

class LocalFirebase {
  private dbKey = 'gran-garden-resort-db';

  private getDB(): LocalStorageDB {
    const data = localStorage.getItem(this.dbKey);
    if (!data) {
      const initialDB: LocalStorageDB = {
        dailyLogs: [],
        photos: [],
        lessonsLearned: []
      };
      this.saveDB(initialDB);
      return initialDB;
    }
    return JSON.parse(data);
  }

  private saveDB(db: LocalStorageDB) {
    localStorage.setItem(this.dbKey, JSON.stringify(db));
  }

  collection(name: keyof LocalStorageDB) {
    return {
      add: (data: any) => {
        const db = this.getDB();
        const newItem = {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString()
        };
        db[name].push(newItem);
        this.saveDB(db);
        return Promise.resolve({ id: newItem.id });
      },
      get: () => {
        const db = this.getDB();
        return Promise.resolve(
          db[name].map((item: any) => ({
            id: item.id,
            data: () => item
          }))
        );
      },
      doc: (id: string) => ({
        update: (data: any) => {
          const db = this.getDB();
          const index = db[name].findIndex((item: any) => item.id === id);
          if (index !== -1) {
            db[name][index] = { ...db[name][index], ...data };
            this.saveDB(db);
          }
          return Promise.resolve();
        },
        delete: () => {
          const db = this.getDB();
          db[name] = db[name].filter((item: any) => item.id !== id);
          this.saveDB(db);
          return Promise.resolve();
        }
      }),
      orderBy: () => ({
        limit: () => ({
          get: () => {
            const db = this.getDB();
            return Promise.resolve(
              db[name].map((item: any) => ({
                id: item.id,
                data: () => item
              }))
            );
          }
        })
      })
    };
  }

  // Simulação de listeners em tempo real
  onSnapshot(collection: string, callback: Function) {
    // Como é local, não há updates em tempo real
    // Mas podemos simular verificando a cada 5 segundos
    const interval = setInterval(() => {
      callback();
    }, 5000);
    
    return () => clearInterval(interval);
  }
}

// Mock do Storage para fotos
class LocalStorage {
  private storageKey = 'gran-garden-resort-photos';

  ref(path: string) {
    return {
      put: async (file: File) => {
        // Converter arquivo para base64
        const base64 = await this.fileToBase64(file);
        const photos = this.getPhotos();
        const photoData = {
          id: Date.now().toString(),
          path,
          data: base64,
          name: file.name
        };
        photos.push(photoData);
        localStorage.setItem(this.storageKey, JSON.stringify(photos));
        
        return {
          ref: {
            getDownloadURL: () => Promise.resolve(base64)
          }
        };
      },
      delete: () => {
        const photos = this.getPhotos();
        const filtered = photos.filter((p: any) => p.path !== path);
        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
        return Promise.resolve();
      }
    };
  }

  private getPhotos() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

// Exports simulando Firebase
export const db = new LocalFirebase();
export const storage = new LocalStorage();
export const auth = {
  currentUser: { uid: 'local-user', email: 'usuario@local.com' }
};

// Funções auxiliares do Firestore
export const collection = (db: any, path: string) => db.collection(path);
export const addDoc = (collectionRef: any, data: any) => collectionRef.add(data);
export const getDocs = (collectionRef: any) => collectionRef.get();
export const updateDoc = (docRef: any, data: any) => docRef.update(data);
export const deleteDoc = (docRef: any) => docRef.delete();
export const doc = (db: any, collection: string, id: string) => db.collection(collection).doc(id);
export const query = (collectionRef: any, ...args: any[]) => collectionRef.orderBy();
export const orderBy = () => {};
export const limit = () => {};
export const onSnapshot = (query: any, callback: Function) => {
  callback();
  return () => {};
};
export const Timestamp = {
  now: () => new Date().toISOString(),
  fromDate: (date: Date) => date.toISOString()
};

// Storage functions
export const ref = (storage: any, path: string) => storage.ref(path);
export const uploadBytes = (ref: any, file: File) => ref.put(file);
export const getDownloadURL = (ref: any) => ref.getDownloadURL();
export const deleteObject = (ref: any) => ref.delete();

console.log('🟢 Firebase Local ativado - Dados salvos no navegador');
console.log('⚠️ Quando configurar o Firebase real, troque para firebase.ts');
