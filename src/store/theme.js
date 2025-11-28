// theme.js

const getTheme = () => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme ? parseInt(storedTheme) : 2; // Valeur par défaut si aucune préférence n'est enregistrée
  };

  const setTheme = (theme) => {
    localStorage.setItem('theme', theme);
  };
  
  export { getTheme, setTheme };