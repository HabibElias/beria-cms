import apiClient from "./Apiclient";

/** Lists and searchable reader pickers must include records after page one. */
export async function fetchAllPages<T extends { id: number }>(
  path: string,
  pageSizeKey = "per_page",
): Promise<T[]> {
  const records = new Map<number, T>();
  let page = 1;
  let lastPage = 1;
  do {
    const response = await apiClient.get<{ data: T[]; last_page?: number }>(
      path,
      { params: { [pageSizeKey]: 100, page } },
    );
    if (!Array.isArray(response.data.data))
      throw new Error("The library returned an incomplete list.");
    for (const record of response.data.data) records.set(record.id, record);
    lastPage = response.data.last_page ?? 1;
    page += 1;
  } while (page <= lastPage);
  return [...records.values()];
}
