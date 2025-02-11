import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

export function useRedirect({ from, to, condition = true }: Params) {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!condition) return;
    if (typeof from === "string" && pathname === from) {
      console.log(`redirecting from ${from} to ${to}`);
      navigate(to, { state });
    } else if (from instanceof RegExp && from.test(pathname)) {
      const newTo = pathname.replace(from, to);
      console.log(`redirecting from ${from} to ${newTo}`);
      navigate(newTo, { state });
    } else {
      console.log("oops... don't know how to redirect", { from, to, pathname });
    }
  }, [pathname, state, from, to, condition, navigate]);
}

type Params = {
  from: string | RegExp;
  to: string;
  condition?: boolean;
};
