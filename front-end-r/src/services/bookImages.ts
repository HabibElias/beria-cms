import apiClient from "./Apiclient";

export async function uploadBookImage(file: File): Promise<{
  book_img: string;
  book_path: string;
}> {
  const data = new FormData();
  data.append("image", file);
  // The API signs Cloudinary uploads. No provider credentials go in the browser.
  const response = await apiClient.post("/book-images", data);
  return response.data;
}
