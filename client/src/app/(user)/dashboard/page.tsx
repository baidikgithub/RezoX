"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "antd";
import { dashboardPath } from "../../../lib/api";
import { useAuth } from "../../../lib/useAuth";

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, ready, hydrate } = useAuth();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!ready) return;
    router.replace(dashboardPath(user?.role));
  }, [ready, router, user?.role]);

  return <Card className="glass-card">Preparing your dashboard...</Card>;
}
