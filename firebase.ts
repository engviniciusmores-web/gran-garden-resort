// Firebase Configuration - MODO OFFLINE (sem Firebase real)
// Quando configurar Firebase real, substitua este arquivo

// Mock Firebase - Não faz nada, apenas simula
export const db = {
  collection: () => ({
    add: () => Promise.resolve({ id: Date.now().toString() }),
    get: () => Promise.resolve({ docs: [] }),
    doc: () => ({
      get: () => Promise.resolve({ exists: false, data: () => ({}) }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve(),
      delete: () => Promise.resolve()
    })
  })
} as any;

export const storage = {
  ref: () => ({
    put: () => Promise.resolve({
      ref: {
        getDownloadURL: () => Promise.resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')
      }
    }),
    delete: () => Promise.resolve()
  })
} as any;

export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: any) => {
    callback(null);
    return () => {};
  }
} as any;

export default { db, storage, auth };

console.log('🟡 Firebase OFFLINE - Sistema funcionando sem banco de dados');
console.log('⚠️ Os dados não serão salvos até configurar o Firebase real');
