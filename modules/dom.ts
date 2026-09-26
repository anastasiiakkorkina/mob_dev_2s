// Required markup is an application invariant: check it instead of asserting it.
export function requireElement<T extends HTMLElement>(id: string, elementType: { new (): T }): T {
  const element = document.getElementById(id);
  if (!(element instanceof elementType)) {
    throw new Error(`Missing or invalid element: #${id}`);
  }
  return element;
}
