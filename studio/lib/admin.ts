// Sites validates these identity headers before forwarding requests to the Worker.
// Keep the original owner while enabling the professor's requested editing account.
const adminEmails = new Set(['flab2025@gmail.com', 'jetnabih@gmail.com']);
export function isAdmin(request: Request): boolean {
  return adminEmails.has((request.headers.get('oai-authenticated-user-email') || '').trim().toLowerCase());
}
