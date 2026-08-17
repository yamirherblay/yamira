export interface Category {
  key: string;
  label: string;
  icon: string;
  image?: string;
}

export const defaultCategories: Category[] = [
  { key: 'all', label: 'Todos', icon: 'fa-solid fa-grid-2' },
  { key: 'Electrodomesticos', label: 'Electrodomésticos', icon: 'fa-solid fa-plug', image: '/images/electrodomesticos.png' },
  { key: 'Variado', label: 'Variado', icon: 'fa-solid fa-boxes-stacked', image: '/images/varios.png' },
  { key: 'Ferreteria', label: 'Ferretería', icon: 'fa-solid fa-hammer', image: '/images/ferreteria.png' },
  { key: 'Moda', label: 'Moda', icon: 'fa-solid fa-shirt', image: '/images/moda.jpg' },
];