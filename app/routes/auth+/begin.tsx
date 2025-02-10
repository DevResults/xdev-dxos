import { useClient } from "@dxos/react-client";
import { useIdentity } from "@dxos/react-client/halo";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Begin() {
  const identity = useIdentity();
  const client = useClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity?.profile?.displayName) {
      navigate("/welcome");
    } else {
      (async () => {
        await client.shell.open();
      })();
    }
  }, [identity]);
  return <></>;
}
