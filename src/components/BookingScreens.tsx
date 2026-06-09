// مسار الملف: src/components/BookingScreens.tsx
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "./SharedUI";
import { BookingsAPI, CoachAPI, getSessionUser } from "@/core/api";
import { useSignupDraft } from "@/core/SignupContext";

const offers = [
  { title: "70 / day", note: "One training day", plan: "daily" },
  { title: "330 / half month", oldPrice: "350", note: "Good for short plans", plan: "half_month" },
  { title: "550 / month", oldPrice: "650", note: "Best monthly offer", plan: "monthly" },
  { title: "3 months", oldPrice: "1500", newPrice: "1650", note: "save 150 L.E.", plan: "3_months" },
  { title: "6 months", oldPrice: "3000", newPrice: "3300", note: "save 300 L.E", plan: "6_months" },
  { title: "a Year", oldPrice: "6150", newPrice: "6600", note: "save 450 L.E.", plan: "yearly" },
];

export function BookingScreen() {
  const router = useRouter();

  function handleBookOffer(plan: string) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedPlan", plan);
    }
    router.push("/booking/payment");
  }

  return (
    <main className="min-h-screen bg-[#fffef8] text-black">
      <section className="relative mx-auto min-h-screen w-full max-w-6xl px-6 py-9">
        <BackButton onClick={() => router.push("/settings")} />
        <h1 className="pt-16 text-[clamp(26px,3vw,36px)] font-black">Booking</h1>
        <div className="mt-8 flex flex-wrap gap-5">
          {offers.slice(0, 3).map((offer) => (
            <button
              key={offer.title}
              type="button"
              onClick={() => handleBookOffer(offer.plan)}
              className="rounded-[8px] bg-[#e5e5e5] px-7 py-4 text-center text-sm font-black transition hover:bg-[#d4d4d4]"
            >
              {offer.title}
            </button>
          ))}
        </div>
        <div className="mt-8 flex h-14 w-44 items-center justify-center bg-[#108bad] text-lg font-black text-white [clip-path:polygon(0_0,88%_0,100%_50%,88%_100%,0_100%)]">offers%</div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {offers.slice(3).map((offer) => (
            <article key={offer.title} className="flex min-h-[245px] flex-col items-center justify-between rounded-[28px] bg-[#d9d9d9] p-6 text-center">
              <div>
                <h2 className="text-xl font-black">{offer.title}</h2>
                {offer.oldPrice && <p className="mt-5 text-sm font-black text-red-600 line-through">{offer.oldPrice}</p>}
                {offer.newPrice && <p className="mt-2 text-lg font-black">{offer.newPrice}</p>}
                <p className="mt-4 text-xs font-bold text-black/55">{offer.note}</p>
              </div>
              <button
                type="button"
                onClick={() => handleBookOffer(offer.plan)}
                className="mt-6 min-h-10 w-28 rounded-full bg-[#108bad] text-sm font-black text-white transition hover:bg-[#0d7c9a]"
              >
                Book
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export function PaymentScreen() {
  const router = useRouter();
  const { role, swimmerDraft } = useSignupDraft();
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");
  const [isLoading, setIsLoading] = useState(false);

  const [coaches, setCoaches] = useState<any[]>([]);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedCoach, setSelectedCoach] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isFetchingOptions, setIsFetchingOptions] = useState(true);

  useEffect(() => {
    async function loadOptions() {
      setIsFetchingOptions(true);
      try {
        const [coachesList, daysList, timesList] = await Promise.all([
          CoachAPI.getList().catch(() => []),
          CoachAPI.getDays().catch(() => []),
          CoachAPI.getTimes().catch(() => []),
        ]);
        setCoaches(Array.isArray(coachesList) ? coachesList : coachesList?.coaches ?? []);
        setAvailableDays(Array.isArray(daysList) ? daysList : daysList?.days ?? []);
        setAvailableTimes(Array.isArray(timesList) ? timesList : timesList?.times ?? []);
      } catch {
        // تجاهل
      } finally {
        setIsFetchingOptions(false);
      }
    }
    loadOptions();
  }, []);

  async function handleBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCoach || !selectedDay || !selectedTime) {
      setMessage("Please select a coach, day, and time.");
      setMessageTone("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // ✅ إصلاح: fallback لـ getSessionUser() لضمان وجود swimmer_id دايمًا
      const sessionUser = getSessionUser();
      const swimmerId = swimmerDraft?.id ?? sessionUser?.id;

      if (!swimmerId) {
        setMessage("Could not find your account. Please log out and log in again.");
        setMessageTone("error");
        setIsLoading(false);
        return;
      }

      await BookingsAPI.create({
        role: role || "swimmer",
        swimmer_id: swimmerId,
        coach_id: Number(selectedCoach),
        day: selectedDay,
        time: selectedTime,
      });

      setMessage("Booking confirmed successfully!");
      setMessageTone("success");
      if (typeof window !== "undefined") sessionStorage.removeItem("selectedPlan");
    } catch (error: any) {
      setMessage(error.message || "Booking failed. Please try again.");
      setMessageTone("error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fffef8] text-black">
      <section className="relative mx-auto min-h-screen w-full max-w-5xl px-6 py-9">
        <BackButton onClick={() => router.push("/booking")} />
        <h1 className="pt-16 text-[clamp(26px,3vw,36px)] font-black">Booking</h1>

        <form onSubmit={handleBook} className="mx-auto mt-10 max-w-3xl rounded-[28px] bg-[#d9d9d9] px-8 py-10">
          <h2 className="text-xl font-black">Book a session</h2>

          {isFetchingOptions ? (
            <p className="mt-6 text-sm font-bold text-black/50">Loading available options...</p>
          ) : (
            <div className="mt-8 space-y-5">
              {/* اختيار المدرب */}
              <label className="block">
                <span className="mb-2 block text-sm font-black">Coach</span>
                <select
                  required
                  value={selectedCoach}
                  onChange={(e) => setSelectedCoach(e.target.value)}
                  className="h-11 w-full rounded-full border border-black/15 bg-white px-4 outline-none focus:border-[#108bad] focus:ring-2 focus:ring-[#108bad]/20"
                >
                  <option value="">Select a coach</option>
                  {coaches.map((coach: any) => (
                    <option key={coach.id} value={coach.id}>
                      {coach.first_name} {coach.last_name}
                    </option>
                  ))}
                </select>
              </label>

              {/* اختيار اليوم */}
              <label className="block">
                <span className="mb-2 block text-sm font-black">Day</span>
                <select
                  required
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="h-11 w-full rounded-full border border-black/15 bg-white px-4 outline-none focus:border-[#108bad] focus:ring-2 focus:ring-[#108bad]/20"
                >
                  <option value="">Select a day</option>
                  {availableDays.map((day: string) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </label>

              {/* اختيار الوقت */}
              <label className="block">
                <span className="mb-2 block text-sm font-black">Time</span>
                <select
                  required
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="h-11 w-full rounded-full border border-black/15 bg-white px-4 outline-none focus:border-[#108bad] focus:ring-2 focus:ring-[#108bad]/20"
                >
                  <option value="">Select a time</option>
                  {availableTimes.map((time: string) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || isFetchingOptions}
            className="mx-auto mt-10 block min-h-11 w-36 rounded-full bg-[#108bad] text-sm font-black text-white transition hover:bg-[#0d7c9a] disabled:opacity-60"
          >
            {isLoading ? "Booking..." : "Confirm Booking"}
          </button>

          {message && (
            <p className={`mt-4 text-center text-sm font-black ${messageTone === "success" ? "text-[#108bad]" : "text-red-600"}`}>
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
