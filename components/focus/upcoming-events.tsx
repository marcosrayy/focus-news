"use client";

import { useEffect, useState } from "react";
import { MapPin, Calendar, ArrowRight, Clock } from "lucide-react";

interface EventData {
  name: string;
  location: string;
  date: string;
  targetDate: Date;
  type: string;
  typeColor: string;
  image: string;
}

const events: EventData[] = [
  {
    name: "Web Summit Rio 2026",
    location: "Rio de Janeiro, RJ",
    date: "28-30 Mai 2026",
    targetDate: new Date("2026-05-28T09:00:00"),
    type: "Feira",
    typeColor: "bg-primary",
    image: "/focus-event-1.jpg",
  },
  {
    name: "Workshop: IA Aplicada ao Marketing",
    location: "Focus HQ - Fortaleza, CE",
    date: "15 Mar 2026",
    targetDate: new Date("2026-03-15T09:00:00"),
    type: "Workshop",
    typeColor: "bg-emerald-600",
    image: "/focus-workshop.jpg",
  },
  {
    name: "Startup Summit Florianopolis",
    location: "Florianopolis, SC",
    date: "10-12 Jun 2026",
    targetDate: new Date("2026-06-10T09:00:00"),
    type: "Palestra",
    typeColor: "bg-blue-600",
    image: "/focus-gallery-3.jpg",
  },
  {
    name: "Treinamento: Automacao com N8N",
    location: "Online - Ao Vivo",
    date: "22 Mar 2026",
    targetDate: new Date("2026-03-22T14:00:00"),
    type: "Treinamento",
    typeColor: "bg-amber-600",
    image: "/news-ai-chip.jpg",
  },
];

function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTimeLeft(calc());
    const interval = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-1.5">
      {[
        { val: timeLeft.days, label: "d" },
        { val: timeLeft.hours, label: "h" },
        { val: timeLeft.minutes, label: "m" },
        { val: timeLeft.seconds, label: "s" },
      ].map((unit) => (
        <div
          key={unit.label}
          className="flex items-center gap-0.5 rounded-md bg-primary/10 px-1.5 py-0.5"
        >
          <span className="text-xs font-bold tabular-nums text-primary">{String(unit.val).padStart(2, "0")}</span>
          <span className="text-[9px] text-primary/70">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

export function UpcomingEvents() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-primary" />
        <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
          PROXIMOS EVENTOS
        </h2>
        <Calendar className="ml-1 h-4 w-4 text-primary" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {events.map((event) => (
          <article
            key={event.name}
            className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="relative h-36 overflow-hidden">
              <img
                src={event.image}
                alt={event.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              <div className="absolute left-3 top-3">
                <span className={`${event.typeColor} rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wider text-white`}>
                  {event.type}
                </span>
              </div>
              <div className="absolute bottom-3 right-3">
                <Countdown targetDate={event.targetDate} />
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4">
              <h3 className="font-heading text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                {event.name}
              </h3>
              <div className="flex flex-col gap-1 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-primary/70" />
                  <span className="text-[11px]">{event.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-primary/70" />
                  <span className="text-[11px]">{event.date}</span>
                </div>
              </div>
              <button className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 py-2 text-[11px] font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground">
                Saiba Mais
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
