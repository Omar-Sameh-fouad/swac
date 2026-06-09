// مسار الملف: src/components/AttendanceScreen.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AttendanceAPI, getSessionUser } from "@/core/api";

type AttendanceRow = {
  id: number;
  day: string;
  month: string;
  state: "Attend" | "Absent";
};

const weekDays = ["S", "S", "M", "T", "W", "T", "F"];
const calendarOffset = 5;
const calendarDays = Array.from({ length: 31 }, (_, index) => index + 1);

function BackIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M14.5 6 8.5 12l6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    </svg>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-11 w-[220px] items-center justify-center gap-4 bg-[#d9d9d9] px-4 text-[14px] font-black md:w-[166px]">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function MiniCalendar({ attendedSet }: { attendedSet: Set<number> }) {
  return (
    <div className="w-[175px]">
      <h2 className="mb-3 text-[14px] font-black">Calendar</h2>
      <div className="grid grid-cols-7 gap-x-2 gap-y-2 text-center text-[7px] font-black text-black/45">
        {weekDays.map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
        {Array.from({ length: calendarOffset }).map((_, index) => (
          <span key={`empty-${index}`} className="h-6" />
        ))}
        {calendarDays.map((day) => (
          <span
            key={day}
            className={[
              "grid h-6 w-6 place-items-center rounded-full justify-self-center",
              attendedSet.has(day) ? "bg-[#d7f2f5] text-black/60" : "text-black/35",
            ].join(" ")}
          >
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}

function AttendanceRange({ attendPercent }: { attendPercent: number }) {
  const absent = 100 - attendPercent;
  return (
    <div>
      <h2 className="text-[15px] font-black">Attendance range</h2>
      <div className="mt-7 flex items-center gap-8">
        <div
          className="grid h-[120px] w-[120px] place-items-center rounded-full shadow-[0_12px_26px_rgba(0,0,0,0.05)]"
          style={{
            background: `conic-gradient(#f92c92 0 ${absent}%, #5a34ee ${absent}% ${attendPercent + absent}%, #f4f0fb ${attendPercent + absent}% 100%)`,
          }}
        >
          <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#fffef8] text-center">
            <span className="text-[16px] font-black leading-none">
              {attendPercent}%
              <span className="block pt-1 text-[7px] leading-none">Total Attend</span>
            </span>
          </div>
        </div>
        <div className="space-y-5 text-[7px] font-black">
          <p className="flex items-center gap-3"><span className="h-3 w-3 bg-[#5a34ee]" />Attend</p>
          <p className="flex items-center gap-3"><span className="h-3 w-3 bg-[#f92c92]" />Absent</p>
        </div>
      </div>
    </div>
  );
}

function getNow() {
  const now = new Date();
  const day = now.getDate().toString();
  const month = now.toLocaleString("en-US", { month: "short" });
  // صيغة الوقت للباك إند (HH:MM:SS)
  const time = now.toLocaleTimeString("en-US", { hour12: false });
  const displayTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return { day, month, time, displayTime, fullDate: `${day} ${month} ${now.getFullYear()}` };
}

export function AttendanceScreen() {
  const router = useRouter();
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [isLogging, setIsLogging] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const now = getNow();

  const sessionUser = getSessionUser();
  const userId = sessionUser?.id;

  const attendedDaysSet = new Set(rows.filter((r) => r.state === "Attend").map((r) => Number(r.day)));
  const totalDays = rows.length;
  const attendedCount = rows.filter((r) => r.state === "Attend").length;
  const attendPercent = totalDays > 0 ? Math.round((attendedCount / totalDays) * 100) : 0;

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const data = await AttendanceAPI.get();
        if (Array.isArray(data)) {
          const mapped: AttendanceRow[] = data.map((item: any, index: number) => {
            const date = new Date(item.date || item.created_at || Date.now());
            return {
              id: item.id || index + 1,
              day: date.getDate().toString(),
              month: date.toLocaleString("en-US", { month: "short" }),
              state: item.status === "present" || item.state === "Attend" ? "Attend" : "Absent",
            };
          });
          setRows(mapped);
        } else if (data?.data && Array.isArray(data.data)) {
           const mapped: AttendanceRow[] = data.data.map((item: any, index: number) => {
            const date = new Date(item.date || item.created_at || Date.now());
            return {
              id: item.id || index + 1,
              day: date.getDate().toString(),
              month: date.toLocaleString("en-US", { month: "short" }),
              state: item.status === "present" ? "Attend" : "Absent",
            };
          });
          setRows(mapped);
        }
      } catch {
        // خطأ صامت
      }
    }
    fetchAttendance();
  }, []);

  async function addAttendance() {
    setIsLogging(true);
    setErrorMsg("");
    try {
      if (!userId) {
        setErrorMsg("User not found. Please log out and log in again.");
        setIsLogging(false);
        return;
      }

      const payload = {
        status: "present",
        date: new Date().toISOString().split("T")[0],
        time: now.time,
      };
      
      const response = await AttendanceAPI.log(payload);

      setRows((currentRows) => [
        ...currentRows,
        {
          id: response?.attendance_id || currentRows.length + 1,
          day: now.day,
          month: now.month,
          state: "Attend",
        },
      ]);
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to log attendance.");
    } finally {
      setIsLogging(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fffef8] text-black">
      <section className="relative mx-auto min-h-screen w-full max-w-[1007px] overflow-x-hidden px-5 pb-8 pt-8 md:min-h-[628px] md:px-0 md:pb-0">
        <button
          aria-label="Back"
          className="absolute left-[38px] top-[34px] z-20 grid h-8 w-8 place-items-center rounded-full bg-[#168dab] text-white shadow-[0_8px_16px_rgba(0,0,0,0.16)] transition hover:bg-[#107f9b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168dab] focus-visible:ring-offset-2"
          onClick={() => router.push("/settings")}
          type="button"
        >
          <BackIcon />
        </button>

        <h1 className="ml-[104px] pt-[26px] text-[21px] font-black md:ml-[123px]">Attendance</h1>

        <div className="mt-8 grid gap-8 md:grid-cols-[722px_1fr] md:gap-9">
          <div className="min-w-0">
            <div className="relative flex min-h-0 flex-col items-center gap-6 md:min-h-[254px] md:block">
              <div className="flex flex-col items-center gap-3 md:contents">
                <div className="md:absolute md:left-[77px] md:top-0">
                  <InfoBox label="Time" value={now.displayTime} />
                </div>
                <div className="md:absolute md:left-[339px] md:top-0">
                  <InfoBox label="Day" value={now.fullDate} />
                </div>
              </div>

              <div className="flex flex-col items-center md:absolute md:left-[263px] md:top-[86px]">
                <button
                  aria-label="Press to attend"
                  disabled={isLogging}
                  className="grid h-28 w-28 place-items-center rounded-full bg-[#168dab] text-[74px] font-light leading-none text-white shadow-[0_8px_20px_rgba(22,141,171,0.12)] transition hover:scale-[1.02] hover:bg-[#107f9b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168dab] focus-visible:ring-offset-4 disabled:opacity-60"
                  onClick={addAttendance}
                  type="button"
                >
                  <span className="-mt-2">{isLogging ? "..." : "+"}</span>
                </button>
                <p className="mt-3 text-[14px] font-black">Press to attend</p>
                {errorMsg && <p className="mt-2 max-w-[200px] text-center text-xs font-bold text-red-600">{errorMsg}</p>}
              </div>
            </div>

            <div
              className="mx-auto mt-7 h-[250px] max-w-full overflow-hidden bg-[#d9d9d9] md:mx-0 md:mt-0"
              style={{ width: "min(722px, calc(100vw - 40px))" }}
            >
              <div className="grid h-[50px] grid-cols-4 items-center border-b border-black/60 text-[14px] font-black">
                <span className="pl-5">id</span>
                <span className="text-center">Day</span>
                <span className="text-center">Month</span>
                <span className="text-center">State</span>
              </div>

              <div className="max-h-[200px] overflow-y-auto text-[13px] font-black">
                {rows.map((row) => (
                  <div className="grid h-10 grid-cols-4 items-center border-b border-black/10" key={row.id}>
                    <span className="pl-5">{row.id}</span>
                    <span className="text-center">{row.day}</span>
                    <span className="text-center">{row.month}</span>
                    <span className="text-center">{row.state}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="flex flex-col items-center gap-7 pt-0 md:items-start">
            <MiniCalendar attendedSet={attendedDaysSet} />
            <AttendanceRange attendPercent={attendPercent} />
          </aside>
        </div>
      </section>
    </main>
  );
}