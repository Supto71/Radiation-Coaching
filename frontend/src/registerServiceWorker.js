export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Radiation PWA ServiceWorker registered with scope: ', registration.scope);
        })
        .catch((error) => {
          console.log('Radiation PWA ServiceWorker registration failed: ', error);
        });
    });
  }
}
