export const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } })
export const body = async <T>(request: Request): Promise<T> => {
  if (typeof request.json === 'function') return request.json() as Promise<T>
  const nodeRequest = request as unknown as { body?: unknown; on: (event: string, callback: (chunk?: Buffer) => void) => void }
  if (nodeRequest.body !== undefined) return (typeof nodeRequest.body === 'string' ? JSON.parse(nodeRequest.body) : nodeRequest.body) as T
  return new Promise<T>((resolve, reject) => {
    const chunks: Buffer[] = []
    nodeRequest.on('data', (chunk) => chunks.push(Buffer.from(chunk ?? '')))
    nodeRequest.on('end', () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString()) as T) } catch (error) { reject(error) } })
    nodeRequest.on('error', reject)
  })
}
