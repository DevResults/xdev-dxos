import { Link } from "react-router"
import { Button } from "@ui/button"
import { by } from "~/lib/by"
import { cx } from "~/lib/cx"
import { getContactMembershipDisplay } from "~/ui/getContactMembershipDisplay"
import { Avatar } from "~/ui/Avatar"
import type { ExtendedContact } from "~/schema/Contact"

export const Members = ({
  self,
  contacts,
  onPromote = () => {},
  onDemote = () => {},
  onInvite = () => {},
  onAddContact = () => {},
  onEdit,
}: Props) => {
  const adminIcon = <IconCircleKey className="size-5 text-primary-500" />

  if (!self || !contacts) {
    return null
  }

  return (
    <>
      <h2 className="flex-1">Members</h2>

      <div
        className="Members my-3 grid w-full max-w-xl gap-x-4 border-t text-sm"
        style={{
          gridTemplateColumns: "min-content 2fr min-content min-content",
        }}
      >
        {/* One row per member */}
        {contacts.sort(by("lastName")).map(contact => {
          // Admin users can toggle status for team members other than themselves
          const canChangeAdminStatus = self.isAdmin && !contact.isSelf
          const { statusLabel, canInvite, canRevoke } = getContactMembershipDisplay(contact)
          return (
            <div
              key={contact.id}
              className="col-span-4 grid grid-cols-subgrid items-center border-b p-2"
            >
              {/* Admin icon */}
              <div className="">
                {contact.isMember ?
                  canChangeAdminStatus ?
                    <button
                      disabled={!self.isAdmin || contact.isSelf}
                      onClick={() => {
                        if (contact.isAdmin) {
                          onDemote(contact.id)
                        } else {
                          onPromote(contact.id)
                        }
                      }}
                      title={
                        contact.isAdmin ?
                          "Team admin (click to remove)"
                        : "Click to make team admin"
                      }
                      className={cx("mx-auto cursor-pointer hover:opacity-25", {
                        "opacity-100": contact.isAdmin,
                        "opacity-0 disabled:opacity-0": !contact.isAdmin,
                      })}
                      children={adminIcon}
                    />
                    // Admin status can't be toggled if self isn't admin, or if contact isn't on team, or if contact is self
                  : <span
                      title={
                        contact.isMember ?
                          contact.isSelf ?
                            "You are team admin"
                          : contact.isAdmin ?
                            "Member is team admin"
                          : "Member is not team admin"
                        : "Contact is not on team"
                      }
                      className={cx({ "opacity-0": !contact.isAdmin }, "mx-auto w-fit")}
                      children={adminIcon}
                    />

                : null}
              </div>

              {/* Name, avatar, metadata */}
              <div className="flex flex-1 flex-row items-start gap-2">
                <Avatar contact={contact} />
                <div>
                  <div className="font-medium">
                    {onEdit ?
                      <button onClick={() => onEdit(contact.id)} className="hover:underline">
                        {contact.firstName}
                      </button>
                    : contact.firstName}
                  </div>
                  <div className="flex flex-row gap-2 divide-x text-xs text-neutral-400 [&>div:not(:first-child)]:pl-2">
                    {contact.isSelf ?
                      <div>You</div>
                    : null}
                    <div>
                      <div>{statusLabel}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invite or revoke button */}
              <div className="text-center">
                {!contact.isSelf && canInvite ?
                  <Button
                    intent="primary"
                    size="xs"
                    onClick={() => {
                      onInvite(contact.id)
                    }}
                  >
                    Invite
                  </Button>
                : null}

                {/* Revoke button */}
                {canRevoke ?
                  <Button asChild intent="danger" size="xs">
                    <Link to={`/team/members/revoke/${contact.id}`} title="Revoke invitation">
                      Revoke
                    </Link>
                  </Button>
                : null}
              </div>

              {/* Remove Button */}
              <div className="">
                {contact.isMember && self.isAdmin && !contact.isSelf ?
                  <Link
                    to="/team/members/remove"
                    state={{ userId: contact.id }}
                    title="Remove member from team"
                    className="opacity-10 hover:text-danger-500 hover:opacity-100"
                    children={<IconTrash className="size-4" />}
                  />
                : null}
              </div>
            </div>
          )
        })}

        <div className="col-span-4 grid grid-cols-subgrid gap-2 border-b p-2 text-center">
          <div></div>
          <div className="flex flex-1 flex-row items-start gap-2">
            <Button
              intent="primary"
              size="xs"
              onClick={() => {
                onAddContact()
              }}
            >
              Add contact
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

type Props = {
  self?: ExtendedContact
  contacts?: ExtendedContact[]
  onPromote?: (userId: string) => void
  onDemote?: (userId: string) => void
  onRemove?: (userId: string) => void
  onInvite?: (userId: string) => void
  onAddContact?: () => void
  onRevokeInvitation?: (userId: string) => void
  onEdit?: (contactId: string) => void
}
