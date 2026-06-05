"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownDisplayProps = {
  headline: string;
  deadlineUtc: string;
};

type CountdownParts = {
  months: number;
  days: number;
  hours: number;
  seconds: number;
  isDone: boolean;
};

function addMonths(date: Date, monthsToAdd: number) {
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth() + monthsToAdd,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds(),
  ));
}

function getCountdownParts(now: Date, deadline: Date): CountdownParts {
  if (now >= deadline) {
    return {
      months: 0,
      days: 0,
      hours: 0,
      seconds: 0,
      isDone: true,
    };
  }

  let months = (deadline.getUTCFullYear() - now.getUTCFullYear()) * 12 + (deadline.getUTCMonth() - now.getUTCMonth());

  if (addMonths(now, months) > deadline) {
    months -= 1;
  }

  while (months < 0) {
    months += 1;
  }

  const anchor = addMonths(now, months);
  const remainingMs = deadline.getTime() - anchor.getTime();

  const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
  const afterDaysMs = remainingMs - days * 1000 * 60 * 60 * 24;

  const hours = Math.floor(afterDaysMs / (1000 * 60 * 60));
  const afterHoursMs = afterDaysMs - hours * 1000 * 60 * 60;

  // Minutes are intentionally folded into seconds to match the requested units.
  const seconds = Math.floor(afterHoursMs / 1000);

  return {
    months,
    days,
    hours,
    seconds,
    isDone: false,
  };
}

function formatUnit(value: number) {
  return value.toString().padStart(2, "0");
}

export function CountdownDisplay({ headline, deadlineUtc }: CountdownDisplayProps) {
  const deadline = useMemo(() => new Date(deadlineUtc), [deadlineUtc]);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  if (Number.isNaN(deadline.getTime())) {
    return (
      <section className="countdown-panel mx-auto w-full max-w-6xl rounded-[2rem] p-6 text-center md:p-10">
        <p className="countdown-kicker">Configuration issue</p>
        <h1 className="mt-4 text-2xl font-semibold md:text-4xl">Unable to parse deadline from API.</h1>
      </section>
    );
  }

  const parts = getCountdownParts(now, deadline);

  return (
    <section className="countdown-panel mx-auto w-full max-w-6xl rounded-[2rem] p-6 md:p-10">
      <p className="countdown-kicker text-center">System Status</p>
      <p className="mt-4 text-center text-balance text-2xl font-semibold tracking-tight text-[var(--countdown-text)] md:text-4xl">
        {headline}
      </p>

      {parts.isDone ? (
        <div className="mt-12 text-center">
          <p className="countdown-complete">We are all good!</p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-4 md:gap-6">
          <article className="countdown-card">
            <p className="countdown-value">{formatUnit(parts.months)}</p>
            <p className="countdown-label">Months</p>
          </article>
          <article className="countdown-card">
            <p className="countdown-value">{formatUnit(parts.days)}</p>
            <p className="countdown-label">Days</p>
          </article>
          <article className="countdown-card">
            <p className="countdown-value">{formatUnit(parts.hours)}</p>
            <p className="countdown-label">Hours</p>
          </article>
          <article className="countdown-card">
            <p className="countdown-value">{formatUnit(parts.seconds)}</p>
            <p className="countdown-label">Seconds</p>
          </article>
        </div>
      )}
    </section>
  );
}
