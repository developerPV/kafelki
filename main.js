document.addEventListener('loadedDependencies', () => window.components.LoadComponents());
document.addEventListener('loadedComponents', (e) => console.log('loaded components', e));