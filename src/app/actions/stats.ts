"use server";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { lastSevenDays } from "@/lib/stats";

export async function getDashboardStats() {
  const user = await requireUser();
  const [total, remembered, weekly] = await Promise.all([
    db.word.count({ where: { deck: { userId: user.id } } }),
    db.word.count({ where: { isRemembered: true, deck: { userId: user.id } } }),
    Promise.all(
      lastSevenDays().map(async ({ date, next }) => ({
        day: new Intl.DateTimeFormat("vi-VN", { weekday: "short", timeZone: "UTC" }).format(date),
        date: date.toISOString().slice(0, 10),
        count: await db.word.count({
          where: { deck: { userId: user.id }, createdAt: { gte: date, lt: next } }
        })
      }))
    )
  ]);
  return {
    total,
    remembered,
    notRemembered: total - remembered,
    percentage: total === 0 ? 0 : Math.round((remembered / total) * 100),
    weekly
  };
}
