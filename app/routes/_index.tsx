import { useRedirect } from "~/hooks/useRedirect";

export default function Index() {
  useRedirect({ from: "/", to: "/myweek" });
  return <></>;
}
