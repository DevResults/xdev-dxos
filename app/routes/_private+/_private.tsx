import { useSpaces, useQuery } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

const Component = () => {
  // Get the user to log in before a space can be obtained.
  const identity = useIdentity();
  // Get the first available space, created with the identity.
  const [space] = useSpaces();
  // Grab everything in the space.
  const objects = useQuery(space, {});
  // Show the id of the first object returned.
  return (
    <>
      {JSON.stringify(identity)}
      {JSON.stringify(space)}
      {objects.map((d) => JSON.stringify(d))}
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
