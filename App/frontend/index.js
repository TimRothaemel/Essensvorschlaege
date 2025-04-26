document.addEventListener("DOMContentLoaded", async function () {
  const modal = document.getElementById("modal");
  const openModalButton = document.getElementById("open-modal");
  const closeModalButton = document.querySelector(".close");
  const form = document.getElementById("add-dish-form");
  const dishNameInput = document.getElementById("dish-name");
  const dishList = document.getElementById("dish-list");

  const DB_NAME = "dishDatabase";
  const DB_VERSION = 1;
  const STORE_NAME = "dishes";
  var delay500ms = 5000;

  let editId = null; // ID des zu bearbeitenden Gerichts

  if (modal) {
    modal.style.display = "none";
  }

  // IndexedDB öffnen
  async function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Fehler beim Öffnen der IndexedDB");
    });
  }

  // Gericht speichern (hinzufügen oder bearbeiten)
  async function saveDish(name) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    if (editId !== null) {
      store.put({ id: editId, name });
    } else {
      store.add({ name });
    }

    return tx.complete;
  }

  // Alle Gerichte aus IndexedDB abrufen
  async function getDishes() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Fehler beim Abrufen der Gerichte");
    });
  }

  // Gericht löschen
  async function removeDish(id) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    return tx.complete;
  }
  //Delay hinzufügen
  

      // Modal öffnen
  if (openModalButton) {
    openModalButton.addEventListener("click", () => {
      editId = null;
      if (dishNameInput) dishNameInput.value = "";
      if (modal) modal.style.display = "flex";
    });
  }

  // Modal schließen
  if (closeModalButton) {
    closeModalButton.addEventListener("click", () => {
      if (modal) modal.style.display = "none";
    });
  }

  // Gericht speichern (über das Formular)
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const dishName = dishNameInput?.value.trim();
      if (!dishName) {
        alert("Bitte einen Namen eingeben!");
        return;
      }

      await saveDish(dishName);

      if (dishNameInput) dishNameInput.value = "";
      if (modal) modal.style.display = "none";

      await renderDishes();
    });
  }

  // Initial Gerichte laden
  await renderDishes();
});
