import type Category from "./Category";

export default interface Book {
  id: number;
  title: string;
  author: string;
  category: Category;
  is_available: boolean;
  location: string;
  dateAdded: string;
  description: string;
  pages: number;
  publisher: string;
  condition: string;
  image: string;
}
