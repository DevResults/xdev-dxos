import { Button } from "@ui/button"
import { Link } from "react-router"
import { by } from "~/lib/by"
import { cx } from "~/lib/cx"
import type { ExtendedContact } from "~/schema/Contact"
import { Avatar } from "~/ui/Avatar"
import { getContactMembershipDisplay } from "~/ui/getContactMembershipDisplay"
import { Heading } from "~/ui/Heading"

export const Members = ({
  self,
  contacts,
  selectedContactId,
  onPromote = () => {},
  onDemote = () => {},
  onInvite = () => {},
  onAddContact = () => {},
}: Props) => {
  const adminIcon = <IconCircleKey className="size-5 text-primary-500" />

  if (!self || !contacts) {
    return null
  }

  return (
    <>
      <Heading level={2}>Members</Heading>
      <div
        className="Members my-3 grid w-full min-w-[35em] max-w-xl gap-x-4 border-t text-sm"
        style={{
          gridTemplateColumns: "min-content 2fr min-content min-content",
        }}
      >
        {/* One row per member */}
        {contacts.toSorted(by("lastName")).map(contact => {
          // Admin users can toggle status for team members other than themselves
          const canChangeAdminStatus = self.isAdmin && !contact.isSelf
          const { statusLabel, canInvite, canRevoke, canViewInvitation } =
            getContactMembershipDisplay(contact)
          return (
            <div
              key={contact.id}
              className={cx(
                "col-span-4 grid grid-cols-subgrid items-center border-b p-2",
                contact.id === selectedContactId && "bg-primary-50",
              )}
            >
              {/* Admin icon */}
              <div className="">
                {contact.isMember ? (
                  canChangeAdminStatus ? (
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
                        contact.isAdmin
                          ? "Team admin (click to remove)"
                          : "Click to make team admin"
                      }
                      className={cx("mx-auto cursor-pointer hover:opacity-25", {
                        "opacity-100": contact.isAdmin,
                        "opacity-0 disabled:opacity-0": !contact.isAdmin,
                      })}
                      children={adminIcon}
                    />
                  ) : (
                    // Admin status can't be toggled if self isn't admin, or if contact isn't on team, or if contact is self
                    <span
                      title={
                        contact.isMember
                          ? contact.isSelf
                            ? "You are team admin"
                            : contact.isAdmin
                              ? "Member is team admin"
                              : "Member is not team admin"
                          : "Contact is not on team"
                      }
                      className={cx({ "opacity-0": !contact.isAdmin }, "mx-auto w-fit")}
                      children={adminIcon}
                    />
                  )
                ) : null}
              </div>

              {/* Name, avatar, metadata */}
              <div className="flex flex-1 flex-row items-start gap-2">
                <Avatar contact={contact} />
                <div>
                  <div className="font-medium">
                    <Link to={`/team/members/${contact.id}`} className="hover:underline">
                      {contact.fullName}
                    </Link>
                  </div>
                  <div className="flex flex-row gap-2 divide-x text-xs text-neutral-400 [&>div:not(:first-child)]:pl-2">
                    {contact.isSelf ? <div>You</div> : null}
                    <div>
                      <div>{statusLabel}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invite, view, or revoke buttons */}
              <div className="flex items-center justify-end gap-2">
                {!contact.isSelf && canInvite ? (
                  <Button
                    intent="primary"
                    size="xs"
                    onClick={() => {
                      onInvite(contact.id)
                    }}
                  >
                    Invite
                  </Button>
                ) : null}

                {/* View invitation button */}
                {canViewInvitation ? (
                  <Button asChild intent="neutral" size="xs">
                    <Link to={`/team/members/invitation/${contact.id}`} title="View invitation">
                      View
                    </Link>
                  </Button>
                ) : null}

                {/* Revoke button */}
                {canRevoke ? (
                  <Button asChild intent="danger" size="xs">
                    <Link to={`/team/members/revoke/${contact.id}`} title="Revoke invitation">
                      Revoke
                    </Link>
                  </Button>
                ) : null}
              </div>

              {/* Remove Button */}
              <div className="">
                {contact.isMember && self.isAdmin && !contact.isSelf ? (
                  <Link
                    to="/team/members/remove"
                    state={{ userId: contact.id }}
                    title="Remove member from team"
                    className="opacity-10 hover:text-danger-500 hover:opacity-100"
                    children={<IconTrash className="size-4" />}
                  />
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
      <div className="py-3">
        <Button
          intent="primary"
          size="sm"
          onClick={() => {
            onAddContact()
          }}
        >
          <IconPlus className="size-4" />
          Add member
        </Button>
      </div>
    </>
  )
}

type Props = {
  self?: ExtendedContact
  contacts?: ExtendedContact[]
  selectedContactId: string | undefined
  onPromote?: (userId: string) => void
  onDemote?: (userId: string) => void
  onRemove?: (userId: string) => void
  onInvite?: (userId: string) => void
  onAddContact?: () => void
  onRevokeInvitation?: (userId: string) => void
}
