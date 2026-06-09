"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  PAYMENT_FORM_FIELDS,
  PAYMENT_ROUTE,
  createEmptyPaymentDetails,
  getPaymentSuccessMessage,
} from "@/core/paymentFlow.mjs";
import { BackButton } from "./SharedUI";

type PaymentFieldName = "cardNumber" | "cardHolderName" | "expireDate" | "cvc";
type PaymentDetails = Record<PaymentFieldName, string>;
type PaymentFormField = {
  name: PaymentFieldName;
  label: string;
  autoComplete: string;
  inputMode: "numeric" | "text";
};

const paymentFormFields = PAYMENT_FORM_FIELDS as readonly PaymentFormField[];

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
    router.push(PAYMENT_ROUTE);
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
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(() => createEmptyPaymentDetails() as PaymentDetails);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");

  function updatePaymentDetails(name: PaymentFieldName, value: string) {
    setPaymentDetails((currentDetails) => ({
      ...currentDetails,
      [name]: value,
    }));

    if (message) {
      setMessage("");
    }
  }

  function handlePayNow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const successMessage = getPaymentSuccessMessage(paymentDetails);
    if (successMessage) {
      setMessage(successMessage);
      setMessageTone("success");
      if (typeof window !== "undefined") sessionStorage.removeItem("selectedPlan");
      return;
    }

    setMessage("Please fill in all card details.");
    setMessageTone("error");
  }

  return (
    <main className="min-h-screen bg-[#fffef8] text-black">
      <section className="relative mx-auto min-h-screen w-full max-w-5xl px-6 py-9">
        <BackButton onClick={() => router.push("/booking")} />
        <h1 className="pt-16 text-[clamp(26px,3vw,36px)] font-black">Booking</h1>

        <form onSubmit={handlePayNow} className="mx-auto mt-10 max-w-4xl rounded-[42px] bg-[#d9d9d9] px-8 py-12 sm:px-14 lg:px-20">
          <h2 className="text-xl font-black">Credit details</h2>

          <div className="mx-auto mt-8 grid max-w-md gap-5">
            {paymentFormFields.slice(0, 2).map((field) => (
              <label key={field.name} className="block">
                <span className="mb-2 block text-sm font-black">{field.label}</span>
                <input
                  required
                  name={field.name}
                  type="text"
                  inputMode={field.inputMode}
                  autoComplete={field.autoComplete}
                  value={paymentDetails[field.name]}
                  onChange={(event) => updatePaymentDetails(field.name, event.target.value)}
                  className="h-9 w-full rounded-full border-0 bg-white px-4 text-sm font-bold outline-none transition focus:ring-2 focus:ring-[#108bad]/35"
                />
              </label>
            ))}

            <div className="grid grid-cols-2 gap-8">
              {paymentFormFields.slice(2).map((field) => (
                <label key={field.name} className="block">
                  <span className="mb-2 block text-sm font-black">{field.label}</span>
                  <input
                    required
                    name={field.name}
                    type="text"
                    inputMode={field.inputMode}
                    autoComplete={field.autoComplete}
                    value={paymentDetails[field.name]}
                    onChange={(event) => updatePaymentDetails(field.name, event.target.value)}
                    className="h-9 w-full rounded-full border-0 bg-white px-4 text-sm font-bold outline-none transition focus:ring-2 focus:ring-[#108bad]/35"
                  />
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="mx-auto mt-10 block min-h-9 w-28 rounded-full bg-[#108bad] text-sm font-black lowercase text-white transition hover:bg-[#0d7c9a]"
          >
            pay now
          </button>

          {message && (
            <p aria-live="polite" className={`mt-4 text-center text-sm font-black ${messageTone === "success" ? "text-[#108bad]" : "text-red-600"}`}>
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
