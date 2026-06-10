// مسار الملف: src/components/ManagerScreens.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "./SharedUI";
import { getSessionUser, ClassesAPI, TeamsAPI, CoachAPI } from "@/core/api";

// ==========================================
// MANAGER HOME & TABLES
// ==========================================
const days = ["Day", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const dayMap: Record<string, string> = {
  Saturday: "Sat", Sunday: "Sun", Monday: "Mon", Tuesday: "Tue",
  Wednesday: "Wed", Thursday: "Thu", Friday: "Fri",
  Sat: "Sat", Sun: "Sun", Mon: "Mon", Tue: "Tue",
  Wed: "Wed", Thu: "Thu", Fri: "Fri",
};

function MenuIcon() { return <svg viewBox="0 0 24 24" className="h-[52%] w-[52%]" aria-hidden><path d="M6 8h12M6 12h12M6 16h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>; }
function ProfileIcon() { return <svg viewBox="0 0 24 24" className="h-[68%] w-[68%]" aria-hidden><circle cx="12" cy="8.4" r="3.2" fill="white" /><path d="M5.8 19.2c.7-3.2 3-5 6.2-5s5.5 1.8 6.2 5" fill="white" /></svg>; }

// ✅ جدول بيعرض داتا حقيقية — كل entry في صفه
function LiveScheduleTable({
  title,
  rows,
  isLoading,
  labelKey,
}: {
  title: string;
  rows: any[];
  isLoading: boolean;
  labelKey: "class_level" | "team_name";
}) {
  const colDays = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  // بنبني map: { dayShort -> entry[] }
  const cellMap: Record<string, { label: string; time: string; coachName: string }[]> = {};
  rows.forEach((row) => {
    const dayShort = dayMap[row.day] ?? row.day;
    if (!cellMap[dayShort]) cellMap[dayShort] = [];
    cellMap[dayShort].push({
      label: row[labelKey] || "-",
      time: row.time || "-",
      coachName: row.coach_name || "-",
    });
  });

  const maxRows = Math.max(1, ...colDays.map((d) => cellMap[d]?.length ?? 0));
  // بنضيف صفوف فاضية عشان الجدول ياخد ارتفاع minimum كويس
  const displayRows = Math.max(maxRows, 3);

  return (
    <section>
      <h2 className="mb-[2px] text-[clamp(10px,1.05vw,13px)] font-black leading-none text-[#108bad]">{title}</h2>
      <div className="w-full overflow-x-auto">
        <table className="h-[clamp(180px,22vh,240px)] w-full min-w-[680px] table-fixed border-collapse bg-transparent text-center">
          <colgroup>
            <col className="w-[13.4%]" />
            {colDays.map((d) => <col key={d} />)}
          </colgroup>
          <thead>
            <tr>
              <th className="h-[25px] border border-[#9d9d9d] bg-white/35 text-[clamp(6px,0.72vw,10px)] font-black">Day</th>
              {colDays.map((d) => <th key={d} className="h-[25px] border border-[#9d9d9d] bg-white/35 text-[clamp(6px,0.72vw,10px)] font-black">{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="border border-[#9d9d9d] py-6 text-[clamp(8px,0.9vw,11px)] font-bold text-black/40">Loading...</td>
              </tr>
            ) : (
              Array.from({ length: displayRows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="h-[clamp(40px,5vh,55px)] border border-[#9d9d9d] bg-white/20 text-[clamp(5px,0.65vw,9px)] font-bold text-black/40">{rowIndex + 1}</td>
                  {colDays.map((day) => {
                    const cell = cellMap[day]?.[rowIndex];
                    return (
                      <td key={`${day}-${rowIndex}`} className="border border-[#9d9d9d] bg-transparent px-[clamp(3px,0.5vw,6px)] py-1 text-left align-middle text-[clamp(5px,0.65vw,9px)] font-bold leading-[1.6]">
                        {cell ? (
                          <>
                            <span className="block font-black text-black">{cell.label}</span>
                            <span className="block text-black/50">{cell.time}</span>
                            <span className="block text-black/35">{cell.coachName}</span>
                          </>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ✅ إصلاح: جلب داتا Classes وTeams من الـ API
export function ManagerHomeScreen() {
  const router = useRouter();

  const sessionUser = typeof window !== "undefined" ? getSessionUser() : null;
  const managerName = [sessionUser?.first_name, sessionUser?.last_name].filter(Boolean).join(" ") || "Manager";

  const [classesData, setClassesData] = useState<any[]>([]);
  const [teamsData, setTeamsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // ✅ جلب الكوتشيز عشان نربط الاسم بالـ coach_id
        const [classesRes, teamsRes, coachesRes] = await Promise.all([
          ClassesAPI.getAll().catch(() => null),
          TeamsAPI.getAll().catch(() => null),
          CoachAPI.getList().catch(() => []),
        ]);

        // بنبني map من coach_id → اسم المدرب
        const coachList = Array.isArray(coachesRes) ? coachesRes : coachesRes?.coaches ?? [];
        const coachMap: Record<number, string> = {};
        coachList.forEach((c: any) => {
          coachMap[c.id] = [c.first_name, c.last_name].filter(Boolean).join(" ");
        });

        // إضافة coach_name للكلاسيز
        const classes = (Array.isArray(classesRes) ? classesRes : classesRes?.data ?? classesRes?.classes ?? [])
          .map((c: any) => ({ ...c, coach_name: coachMap[c.coach_id] || c.coach_id }));

        // إضافة coach_name للتيمز
        const teams = (Array.isArray(teamsRes) ? teamsRes : teamsRes?.data ?? teamsRes?.teams ?? [])
          .map((t: any) => ({ ...t, coach_name: coachMap[t.coach_id] || t.coach_id }));

        setClassesData(classes);
        setTeamsData(teams);
      } catch {
        // صامت
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffef8] text-black">
      <button type="button" onClick={() => router.push("/roles")} aria-label="Open menu" className="absolute left-[clamp(20px,4vw,48px)] top-[clamp(26px,5vh,45px)] z-30 flex h-[clamp(36px,4.8vw,48px)] w-[clamp(36px,4.8vw,48px)] items-center justify-center rounded-full bg-[#108bad] text-white shadow-[0_9px_18px_-14px_rgba(0,0,0,0.8)] transition hover:bg-[#0d7c9a]"><MenuIcon /></button>
      <button type="button" onClick={() => router.push("/profile")} aria-label="Manager profile" className="absolute right-[clamp(20px,4.5vw,54px)] top-[clamp(27px,5vh,45px)] z-30 flex h-[clamp(31px,4.2vw,43px)] w-[clamp(31px,4.2vw,43px)] items-center justify-center rounded-full bg-[#b8c2c2] text-white"><ProfileIcon /></button>

      <section className="mx-auto min-h-screen w-full px-[clamp(12px,6.8vw,78px)] py-[clamp(52px,8.2vh,84px)]">
        <header className="mb-[clamp(16px,2.6vh,25px)] pt-[clamp(32px,5vh,48px)]">
          <h1 className="text-[clamp(18px,2vw,24px)] font-black leading-none">Home</h1>
          <p className="mt-[14px] text-[clamp(12px,1.25vw,15px)] font-black leading-none text-[#108bad]">Welcome Manager</p>
          <p className="mt-[12px] text-[clamp(9px,0.9vw,11px)] font-bold leading-none text-black/25">{managerName}</p>
        </header>

        <div className="relative">
          <Image src="/images/swim-master-logo-clean.png" alt="" aria-hidden="true" width={975} height={963} sizes="(max-width: 768px) 80vw, 610px" className="pointer-events-none absolute left-1/2 top-[34%] z-0 h-auto w-[clamp(360px,50vw,610px)] -translate-x-1/2 -translate-y-1/2 object-contain opacity-55 mix-blend-multiply brightness-125 contrast-80 saturate-110 hue-rotate-[10deg]" />
          <div className="relative z-10">
            {/* ✅ جدول الكلاسيز بداتا حقيقية */}
            <LiveScheduleTable title="The Classes Table" rows={classesData} isLoading={isLoading} labelKey="class_level" />
            <button type="button" onClick={() => router.push("/manager/classes")} className="mx-auto mt-[clamp(14px,2.7vh,24px)] flex min-h-[44px] w-[clamp(106px,12vw,130px)] items-center justify-center rounded-full bg-[#108bad] text-[clamp(12px,0.82vw,13px)] font-black text-white shadow-[0_8px_15px_-12px_rgba(0,0,0,0.9)] transition hover:bg-[#0d7c9a] md:min-h-[clamp(25px,3.2vh,32px)]">Edit</button>

            <div className="mt-[clamp(22px,4vh,38px)]">
              {/* ✅ جدول التيمز بداتا حقيقية */}
              <LiveScheduleTable title="The Teams Table" rows={teamsData} isLoading={isLoading} labelKey="team_name" />
            </div>
            <button type="button" onClick={() => router.push("/manager/teams")} className="mx-auto mt-[clamp(25px,4vh,42px)] flex min-h-[44px] w-[clamp(108px,12vw,132px)] items-center justify-center rounded-full bg-[#108bad] text-[clamp(12px,0.82vw,13px)] font-black text-white shadow-[0_8px_15px_-12px_rgba(0,0,0,0.9)] transition hover:bg-[#0d7c9a] md:min-h-[clamp(28px,3.6vh,34px)]">Edit</button>
          </div>
        </div>
      </section>
    </main>
  );
}

// ✅ إصلاح: استبدال onBack/onDone بـ useRouter
export function TeamsTableScreen() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#fffef8] px-[5vw] py-[6vh] text-black max-md:px-[4vw]">
      <BackButton onClick={() => router.push("/manager/home")} />
      <section className="mx-auto flex min-h-[88vh] w-full max-w-[920px] flex-col justify-center pt-12 md:pt-0">
        <h1 className="mb-[2.2vh] text-[clamp(16px,1.65vw,19px)] font-black text-[#108bad]">Please put the teams table</h1>
        <div className="relative overflow-x-auto overflow-y-hidden border border-[#9d9d9d] bg-white">
          <Image
            src="/images/swimmer-table-bg.png"
            alt=""
            aria-hidden="true"
            width={1537}
            height={1023}
            sizes="(max-width: 768px) 82vw, 740px"
            className="pointer-events-none absolute left-1/2 top-[56%] z-0 h-auto max-h-[92%] w-[82%] max-w-[740px] -translate-x-1/2 -translate-y-1/2 object-contain opacity-35 saturate-90"
          />
          <table className="relative z-10 h-[min(52vh,500px)] min-h-[355px] w-full min-w-[720px] table-fixed border-collapse bg-transparent text-center">
            <thead>
              <tr>
                {days.map((day) => (
                  <th key={day} className="h-[44px] border border-[#9d9d9d] bg-white/45 text-[clamp(8px,0.82vw,11px)] font-black">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="border border-[#9d9d9d] bg-white/35 px-[1.3vw] text-left text-[clamp(7px,0.72vw,10px)] font-bold leading-[1.7]">
                    <span className="block">Team name</span>
                    <span className="block">time</span>
                    <span className="block">coach name</span>
                  </td>
                  {days.slice(1).map((day) => (
                    <td key={`${day}-${index}`} className="border border-[#9d9d9d] bg-transparent" />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* ✅ إصلاح: Done يرجع لـ /manager/home */}
        <button
          type="button"
          onClick={() => router.push("/manager/home")}
          className="mx-auto mt-[4vh] min-h-[44px] w-[clamp(112px,13vw,135px)] rounded-full bg-[#108bad] text-[clamp(12px,1vw,13px)] font-black text-white shadow-[0_8px_16px_-12px_rgba(0,0,0,0.85)] transition hover:bg-[#0d7c9a]"
        >
          Done
        </button>
      </section>
    </main>
  );
}

// ✅ جديد: شاشة تعديل الكلاسيز (مماثلة للتيمز)
export function ClassesTableScreen() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#fffef8] px-[5vw] py-[6vh] text-black max-md:px-[4vw]">
      <BackButton onClick={() => router.push("/manager/home")} />
      <section className="mx-auto flex min-h-[88vh] w-full max-w-[920px] flex-col justify-center pt-12 md:pt-0">
        <h1 className="mb-[2.2vh] text-[clamp(16px,1.65vw,19px)] font-black text-[#108bad]">Please put the classes table</h1>
        <div className="relative overflow-x-auto overflow-y-hidden border border-[#9d9d9d] bg-white">
          <Image
            src="/images/swimmer-table-bg.png"
            alt=""
            aria-hidden="true"
            width={1537}
            height={1023}
            sizes="(max-width: 768px) 82vw, 740px"
            className="pointer-events-none absolute left-1/2 top-[56%] z-0 h-auto max-h-[92%] w-[82%] max-w-[740px] -translate-x-1/2 -translate-y-1/2 object-contain opacity-35 saturate-90"
          />
          <table className="relative z-10 h-[min(52vh,500px)] min-h-[355px] w-full min-w-[720px] table-fixed border-collapse bg-transparent text-center">
            <thead>
              <tr>
                {days.map((day) => (
                  <th key={day} className="h-[44px] border border-[#9d9d9d] bg-white/45 text-[clamp(8px,0.82vw,11px)] font-black">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="border border-[#9d9d9d] bg-white/35 px-[1.3vw] text-left text-[clamp(7px,0.72vw,10px)] font-bold leading-[1.7]">
                    <span className="block">Class Level</span>
                    <span className="block">time</span>
                    <span className="block">coach name</span>
                  </td>
                  {days.slice(1).map((day) => (
                    <td key={`${day}-${index}`} className="border border-[#9d9d9d] bg-transparent" />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={() => router.push("/manager/home")}
          className="mx-auto mt-[4vh] min-h-[44px] w-[clamp(112px,13vw,135px)] rounded-full bg-[#108bad] text-[clamp(12px,1vw,13px)] font-black text-white shadow-[0_8px_16px_-12px_rgba(0,0,0,0.85)] transition hover:bg-[#0d7c9a]"
        >
          Done
        </button>
      </section>
    </main>
  );
}
