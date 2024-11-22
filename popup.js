document.addEventListener('DOMContentLoaded', function() {
  // Asigna el contenido traducido a los elementos del popup
  document.getElementById('popupTitle').textContent = chrome.i18n.getMessage('popup_title');
  document.getElementById('deleteCookies').textContent = chrome.i18n.getMessage('delete_button');
  
  //  evento botón para limpiar las cookies
  document.getElementById("deleteCookies").addEventListener("click", async () => {

    try {
      //  pestaña activa actual
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab || !tab.url) {
        alert(chrome.i18n.getMessage("error_no_tab"));
        return;
      }

      const url = new URL(tab.url);
      const domain = url.hostname;

      // Obtenemos todas las cookies del dominio actual
      chrome.cookies.getAll({ domain: domain }, (cookies) => {
        if (!cookies || cookies.length === 0) {
          alert(chrome.i18n.getMessage("error_no_cookies"));
          return;
        }

        let count = 0;

        cookies.forEach((cookie) => {
          const details = {
            url: `${url.protocol}//${cookie.domain.startsWith(".") ? cookie.domain.slice(1) : cookie.domain}${cookie.path}`,
            name: cookie.name
          };

          // Elimina las cookies
          chrome.cookies.remove(details, () => {
            count++;
            if (count === cookies.length) {
              alert(chrome.i18n.getMessage("cookies_deleted", [count, domain]));
            }
          });
        });
      });
    } catch (error) {
      console.error("Error al eliminar cookies:", error);
      alert(chrome.i18n.getMessage("error_generic"));
    }

  });
});

