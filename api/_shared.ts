export const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } })
export const body = async <T>(request: Request): Promise<T> => request.json() as Promise<T>
