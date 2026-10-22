import { useEffect } from 'react';

// Loads the stylesheets used by the design pages (Bootstrap grid, FontAwesome icons,
// Inter / Space Grotesk fonts) only while one of those pages is open, so the rest
// of the site keeps its current styling.
const LINKS = [
  { id: 'ayinde-bootstrap-css', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' },
  { id: 'ayinde-fontawesome-css', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' },
  { id: 'ayinde-fonts-css', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap' },
];

const useSiteStyles = () => {
  useEffect(() => {
    const added = [];
    LINKS.forEach(({ id, href }) => {
      if (!document.getElementById(id)) {
        const el = document.createElement('link');
        el.id = id;
        el.rel = 'stylesheet';
        el.href = href;
        document.head.appendChild(el);
        added.push(el);
      }
    });
    return () => added.forEach((el) => el.remove());
  }, []);
};

export default useSiteStyles;
