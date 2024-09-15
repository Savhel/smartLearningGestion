// stores/currentUser.js
import { writable } from 'svelte/store';

// Vérifier si sessionStorage est disponible
const sessionStorageAvailable = typeof window !== 'undefined' && window.sessionStorage;

let initialUser = {};
if (sessionStorageAvailable) {
    const storedUser = window.sessionStorage.getItem('currentUser');
    initialUser = storedUser ? JSON.parse(storedUser) : null;
}

export const currentUser = writable(initialUser);

// Sauvegarder les données dans sessionStorage à chaque mise à jour
currentUser.subscribe(value => {
    if (sessionStorageAvailable) {
        if (value) {
            window.sessionStorage.setItem('currentUser', JSON.stringify(value));
        } else {
            window.sessionStorage.removeItem('currentUser');
        }
        console.log('currentUser updated:', value);
    }
});