/** Check whether invitation code should be persisted. */
export function shouldUpdateInvitationCode(
  currentCode: string,
  nextCode: string | undefined,
): boolean {
  return Boolean(nextCode) && currentCode !== nextCode
}
