import { useSpaces, useQuery } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import { humanize } from "@dxos/util";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

const Component = () => {
  // Get the user to log in before a space can be obtained.
  const identity = useIdentity();
  // Get the first available space, created with the identity.
  const spaces = useSpaces();
  // Grab everything in the first space.
  const objects = useQuery(spaces[0], {});
  // Show the id of the first object returned.
  return (
    <>
      {JSON.stringify(identity, null, 2)}
      {spaces.map((d) => JSON.stringify({ id: humanize(d.id), properties: d.properties }, null, 2))}
      {objects.map((d) => JSON.stringify(d, null, 2))}
    </>
  );
};

export default function Private() {
  const identity = useIdentity();
  const navigate = useNavigate();
  useEffect(() => {
    if (!identity?.profile) navigate("/auth/begin");
  }, [identity]);
  return (
    <>
      <Component />
      <Outlet />
    </>
  );
}
