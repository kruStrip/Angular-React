export async function loadJson<T>(name: string): Promise<T> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/${name}`)
  if (!response.ok) {
    throw new Error(`Файл ${name} не загрузился: код ${response.status}.`)
  }
  return response.json() as Promise<T>
}
