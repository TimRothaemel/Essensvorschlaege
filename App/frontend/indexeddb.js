console.log("indexeddb.js wurde geladen!");

// Prüfen, ob die aktuelle Seite dishlist.html ist
if (window.location.pathname.includes("dishlist.html")) {
  console.log("Wir befinden uns auf dishlist.html");

  document.addEventListener("DOMContentLoaded", async () => {
    const dishList = document.getElementById("dish-list");

    if (!dishList) {
      console.error("Element mit ID 'dish-list' nicht gefunden.");
      return;
    }

    await renderDishes();
  });

  async function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("dishDatabase", 1);

      request.onupgradeneeded = (event) => {
        let db = event.target.result;
        if (!db.objectStoreNames.contains("dishes")) {
          db.createObjectStore("dishes", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Fehler beim Öffnen der Datenbank");
    });
  }

  async function getDishes() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("dishes", "readonly");
      const store = tx.objectStore("dishes");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Fehler beim Abrufen der Gerichte");
    });
  }

  async function renderDishes() {
    const dishList = document.getElementById("dish-list");

    if (!dishList) {
      console.error("Das Element mit der ID 'dish-list' wurde nicht gefunden!");
      return;
    }

    console.log("Gerichte werden angezeigt...");
    dishList.innerHTML = "";
    const dishes = await getDishes();
    console.log("Gerichte aus IndexedDB:", dishes);

    dishes.forEach((dish) => {
      const listItem = document.createElement("li");
      listItem.textContent = dish.name;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "X";
      deleteButton.onclick = async () => {
        await removeDish(dish.id);
        renderDishes();
      };

      listItem.appendChild(deleteButton);
      dishList.appendChild(listItem);
    });
  }

  async function removeDish(id) {
    const db = await openDB();
    const tx = db.transaction("dishes", "readwrite");
    const store = tx.objectStore("dishes");
    store.delete(id);
    await tx.complete;
  }
}
