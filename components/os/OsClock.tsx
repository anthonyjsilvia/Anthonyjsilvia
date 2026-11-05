"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Moon, Power } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { localeMeta } from "@/lib/i18n/languages";
import type { DockEdge } from "@/lib/os-dock";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  edge: DockEdge;
  dark: boolean;
  onDarkChange: (on: boolean) => void;
  onExit: () => void;
};

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function OsClock({ open, onOpenChange, edge, dark, onDarkChange, onExit }: Props) {
  const { locale, messages } = useLocale();
  const htmlLang = localeMeta(locale).htmlLang;
  const { os } = messages;
  const [now, setNow] = useState(() => new Date());
  const [cursor, setCursor] = useState(() => new Date());
  const weekStartsOn = locale === "en-US" ? 0 : 1;

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (open) setCursor(new Date());
  }, [open]);

  const time = new Intl.DateTimeFormat(htmlLang, {
    hour: "numeric",
    minute: "2-digit",
  }).format(now);
  const date = new Intl.DateTimeFormat(htmlLang, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(now);

  const monthLabel = new Intl.DateTimeFormat(htmlLang, {
    month: "long",
    year: "numeric",
  }).format(cursor);

  const weekdayLabels = useMemo(() => {
    const start = new Date(2024, 0, 7 + weekStartsOn);
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return new Intl.DateTimeFormat(htmlLang, { weekday: "narrow" }).format(day);
    });
  }, [htmlLang, weekStartsOn]);

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const offset = (first.getDay() - weekStartsOn + 7) % 7;
    const count = new Date(year, month + 1, 0).getDate();
    const days: (Date | null)[] = Array.from({ length: offset }, () => null);
    for (let day = 1; day <= count; day += 1) days.push(new Date(year, month, day));
    while (days.length % 7) days.push(null);
    return days;
  }, [cursor, weekStartsOn]);

  const shiftMonth = (delta: number) => {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));
  };

  return (
    <div className="os-clock">
      <button
        type="button"
        className={`os-clock__button${open ? " is-open" : ""}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`${time}, ${date}. ${os.calendar}`}
        onClick={() => onOpenChange(!open)}
      >
        <span className="os-clock__time">{time}</span>
        <span className="os-clock__date">{date}</span>
      </button>
      {open ? (
        <div className={`os-calendar os-calendar--${edge}`} role="dialog" aria-label={os.calendar}>
          <div className="os-calendar__head">
            <button
              type="button"
              className="os-calendar__nav"
              aria-label={os.previousMonth}
              onClick={() => shiftMonth(-1)}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <p className="os-calendar__month">{monthLabel}</p>
            <button
              type="button"
              className="os-calendar__nav"
              aria-label={os.nextMonth}
              onClick={() => shiftMonth(1)}
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="os-calendar__weekdays" aria-hidden="true">
            {weekdayLabels.map((label, index) => (
              <span key={`${label}-${index}`}>{label}</span>
            ))}
          </div>
          <div className="os-calendar__grid">
            {cells.map((day, index) =>
              day ? (
                <span
                  key={day.toISOString()}
                  className={`os-calendar__day${sameDay(day, now) ? " is-today" : ""}`}
                >
                  {day.getDate()}
                </span>
              ) : (
                <span key={`empty-${index}`} />
              ),
            )}
          </div>
          <button type="button" className="os-calendar__today" onClick={() => setCursor(new Date())}>
            {os.today}
          </button>
          <div className="os-calendar__actions">
            <p className="os-calendar__actions-title">{os.quickActions}</p>
            <button
              type="button"
              className="os-calendar__action"
              role="switch"
              aria-checked={dark}
              aria-label={os.darkMode}
              onClick={() => onDarkChange(!dark)}
            >
              <Moon className="os-calendar__action-icon" aria-hidden="true" />
              <span className="os-calendar__action-copy">
                <span className="os-calendar__action-label">{os.darkMode}</span>
                <span className="os-calendar__action-hint">{os.darkModeBody}</span>
              </span>
              <span className={`os-a11y__switch${dark ? " is-on" : ""}`} aria-hidden="true">
                <span className="os-a11y__switch-knob" />
              </span>
            </button>
            <button type="button" className="os-calendar__action os-calendar__action--power" onClick={onExit}>
              <Power className="os-calendar__action-icon" aria-hidden="true" />
              <span className="os-calendar__action-label">{os.exitOs}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
