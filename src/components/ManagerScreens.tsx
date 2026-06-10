// مسار الملف: src/components/ManagerScreens.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "./SharedUI";
import { getSessionUser, ClassesAPI, TeamsAPI, CoachAPI, clearSession } from "@/core/api";
import { useSignupDraft } from "@/core/SignupContext";

function ArrowRightIcon() { return <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }
function BackArrowIcon() { return <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" aria-hidden><path d="M14.5 6 8.5 12l6 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" /></svg>; }
function LogoutIcon() { return <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden><path d="M13 5h5v14h-5M8 8l-4 4 4 4M4 12h11" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }
function MenuIcon() { return <svg viewBox="0 0 24 24" className="h-[52%] w-[52%]" aria-hidden><path d="M6 8h12M6 12h12M6 16h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>; }
function ProfileIcon() { return <svg viewBox="0 0 24 24" className="h-[68%] w-[68%]" aria-hidden><circle cx="12" cy="8.4" r="3.2" fill="white" /><path d="M5.8 19.2c.7-3.2 3-5 6.2-5s5.5 1.8 6.2 5" fill="white" /></svg>; }

const days = ["Day", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const colDays = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const dayMap: Record<string, string> = {
  Saturday: "Sat", Sunday: "Sun", Monday: "Mon", Tuesday: "Tue",
  Wednesday: "Wed", Thursday: "Thu", Friday: "Fri",
  Sat: "Sat", Sun: "Sun", Mon: "Mon", Tue: "Tue",
  Wed: "Wed", Thu: "Thu", Fri: "Fri",
};

const fullDayMap: Record<string, string> = {
  Sat: "Saturday", Sun: "Sunday", Mon: "Monday", Tue: "Tuesday",
  Wed: "Wednesday", Thu: "Thursday", Fri: "Friday"
};

// ==========================================
// MANAGER MENU
// ==========================================
export function ManagerMenuScreen() {
  const router = useRouter();
  const { resetSignupDraft } = useSignupDraft();

  return (
    <main className="min-h-screen bg-[#fffef8] text-black">
      <section className="relative mx-auto grid min-h-screen w-full max-w-[1728px] grid-cols-[62%_38%] px-[clamp(28px,4vw,68px)] py-[clamp(34px,5.6vh,60px)] max-lg:grid-cols-1 max-lg:gap-10 max-md:px-5">
        <button type="button" onClick={() => router.push("/manager/home")} aria-label="Back to manager home" className="absolute left-[clamp(28px,3.7vw,70px)] top-[clamp(26px,5.4vh,58px)] z-30 flex h-[54px] w-[58px] items-center justify-center rounded-full bg-[#108bad] text-white shadow-[0_10px_18px_-14px_rgba(0,0,0,0.9)] transition hover:bg-[#0d7c9a]"><BackArrowIcon /></button>
        <div className="flex min-h-[calc(100vh-120px)] flex-col justify-center pt-16 max-lg:min-h-0">
          <h1 className="ml-[clamp(72px,8vw,100px)] text-[clamp(30px,2.3vw,36px)] font-black leading-none max-md:ml-0">Menu</h1>
          <div className="relative mt-10 h-[min(42vw,620px)] min-h-[320px] w-full max-lg:h-[48vw] max-md:h-[62vw] max-md:min-h-[260px]">
            <Image src="/images/swimmer-role-new.jpg" alt="Swimmer in the pool" fill priority sizes="(max-width: 768px) 92vw, (max-width: 1024px) 80vw, 58vw" className="object-contain object-center opacity-85" />
          </div>
        </div>
        <div className="flex min-h-[calc(100vh-120px)] items-center border-l-4 border-black/45 pl-[clamp(54px,7vw,150px)] max-lg:min-h-0 max-lg:border-l-0 max-lg:border-t-2 max-lg:py-10 max-lg:pl-0">
          <div className="flex w-full flex-col items-center gap-8">
            <button type="button" onClick={() => router.push("/manager/home")} className="flex h-[82px] w-[282px] items-center justify-center gap-3 rounded-[18px] bg-white text-[24px] font-medium text-black shadow-[0_10px_18px_-15px_rgba(0,0,0,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_22px_-16px_rgba(0,0,0,0.9)] max-md:h-[64px] max-md:w-full max-md:max-w-[282px] max-md:text-[20px]"><span>Home</span><ArrowRightIcon /></button>
            <button type="button" onClick={() => router.push("/settings")} className="flex h-[82px] w-[282px] items-center justify-center gap-3 rounded-[18px] bg-white text-[24px] font-medium text-black shadow-[0_10px_18px_-15px_rgba(0,0,0,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_22px_-16px_rgba(0,0,0,0.9)] max-md:h-[64px] max-md:w-full max-md:max-w-[282px] max-md:text-[20px]"><span>Settings</span><ArrowRightIcon /></button>
            <button
              type="button"
              onClick={() => { resetSignupDraft(); clearSession(); router.replace("/login"); }}
              className="flex h-[82px] w-[282px] items-center justify-center gap-3 rounded-[18px] bg-white text-[24px] font-medium text-black shadow-[0_10px_18px_-15px_rgba(0,0,0,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_22px_-16px_rgba(0,0,0,0.9)] max-md:h-[64px] max-md:w-full max-md:max-w-[282px] max-md:text-[20px]"
            >
              <span className="text-red-600">Log out</span><span className="text-red-600"><LogoutIcon /></span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

// ==========================================
// LIVE SCHEDULE TABLE (HOME)
// ==========================================
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

  const maxDataRows = Math.max(0, ...colDays.map((d) => cellMap[d]?.length ?? 0));
  const displayRows = Math.max(5, maxDataRows); 
  const mainLabel = labelKey === "class_level" ? "Class Level" : "Team name";

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
                  <td className="border border-[#9d9d9d] bg-white/35 px-[1.3vw] py-1 text-left text-[clamp(7px,0.72vw,10px)] font-bold leading-[1.7]">
                    <span className="block">{mainLabel}</span>
                    <span className="block">time</span>
                    <span className="block">coach name</span>
                  </td>
                  {colDays.map((day) => {
                    const cell = cellMap[day]?.[rowIndex];
                    return (
                      <td key={`${day}-${rowIndex}`} className="h-[clamp(40px,5vh,55px)] border border-[#9d9d9d] bg-transparent px-[clamp(3px,0.5vw,6px)] py-1 text-center align-middle text-[clamp(6px,0.7vw,10px)] font-bold leading-[1.6]">
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

// ==========================================
// MANAGER HOME SCREEN
// ==========================================
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
        const [classesRes, teamsRes, coachesRes] = await Promise.all([
          ClassesAPI.getAll().catch(() => null),
          TeamsAPI.getAll().catch(() => null),
          CoachAPI.getList().catch(() => []),
        ]);

        const rawCoaches = coachesRes?.data?.users || coachesRes?.data || coachesRes?.users || coachesRes?.coaches || coachesRes;
        const coachList = Array.isArray(rawCoaches) ? rawCoaches : [];
        const coachMap: Record<string | number, string> = {};
        coachList.forEach((c: any) => {
          const id = c.id || c._id;
          if (id) coachMap[id] = [c.first_name, c.last_name].filter(Boolean).join(" ") || c.name || "Unknown Coach";
        });

        const rawClasses = Array.isArray(classesRes) ? classesRes : classesRes?.data?.classes || classesRes?.data || classesRes?.classes || [];
        const classes = rawClasses.map((c: any) => {
          const coachId = c.coach_id || c.coachId || c.coach?.id || c.coach?._id;
          const nestedName = c.coach?.first_name ? `${c.coach.first_name} ${c.coach.last_name || ''}`.trim() : c.coach?.name;
          const finalCoachName = c.coach_name || nestedName || (coachId ? coachMap[coachId] : null) || (coachId ? `Coach ID: ${coachId}` : "-");
          return { ...c, coach_name: finalCoachName };
        });

        const rawTeams = Array.isArray(teamsRes) ? teamsRes : teamsRes?.data?.teams || teamsRes?.data || teamsRes?.teams || [];
        const teams = rawTeams.map((t: any) => {
          const coachId = t.coach_id || t.coachId || t.coach?.id || t.coach?._id;
          const nestedName = t.coach?.first_name ? `${t.coach.first_name} ${t.coach.last_name || ''}`.trim() : t.coach?.name;
          const finalCoachName = t.coach_name || nestedName || (coachId ? coachMap[coachId] : null) || (coachId ? `Coach ID: ${coachId}` : "-");
          return { ...t, coach_name: finalCoachName };
        });

        setClassesData(classes);
        setTeamsData(teams);
      } catch {
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffef8] text-black">
      <button type="button" onClick={() => router.push("/manager/menu")} aria-label="Open menu" className="absolute left-[clamp(20px,4vw,48px)] top-[clamp(26px,5vh,45px)] z-30 flex h-[clamp(36px,4.8vw,48px)] w-[clamp(36px,4.8vw,48px)] items-center justify-center rounded-full bg-[#108bad] text-white shadow-[0_9px_18px_-14px_rgba(0,0,0,0.8)] transition hover:bg-[#0d7c9a]"><MenuIcon /></button>
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
            <LiveScheduleTable title="The Classes Table" rows={classesData} isLoading={isLoading} labelKey="class_level" />
            <button type="button" onClick={() => router.push("/manager/classes")} className="mx-auto mt-[clamp(14px,2.7vh,24px)] flex min-h-[44px] w-[clamp(106px,12vw,130px)] items-center justify-center rounded-full bg-[#108bad] text-[clamp(12px,0.82vw,13px)] font-black text-white shadow-[0_8px_15px_-12px_rgba(0,0,0,0.9)] transition hover:bg-[#0d7c9a] md:min-h-[clamp(25px,3.2vh,32px)]">Edit</button>

            <div className="mt-[clamp(22px,4vh,38px)]">
              <LiveScheduleTable title="The Teams Table" rows={teamsData} isLoading={isLoading} labelKey="team_name" />
            </div>
            <button type="button" onClick={() => router.push("/manager/teams")} className="mx-auto mt-[clamp(25px,4vh,42px)] flex min-h-[44px] w-[clamp(108px,12vw,132px)] items-center justify-center rounded-full bg-[#108bad] text-[clamp(12px,0.82vw,13px)] font-black text-white shadow-[0_8px_15px_-12px_rgba(0,0,0,0.9)] transition hover:bg-[#0d7c9a] md:min-h-[clamp(28px,3.6vh,34px)]">Edit</button>
          </div>
        </div>
      </section>
    </main>
  );
}

// ==========================================
// TEAMS TABLE SCREEN (EDIT MODE)
// ==========================================
export function TeamsTableScreen() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<any>(null); 
  const [popup, setPopup] = useState<{ show: boolean; message: string; type: "success" | "error" }>({ show: false, message: "", type: "success" });

  const showPopup = (message: string, type: "success" | "error" = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "success" }), 3000);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [teamsRes, coachesRes] = await Promise.all([
          TeamsAPI.getAll().catch(() => null),
          CoachAPI.getList().catch(() => []),
        ]);
        const rawTeams = Array.isArray(teamsRes) ? teamsRes : teamsRes?.data?.teams || teamsRes?.data || [];
        setData(rawTeams);

        const rawCoaches = coachesRes?.data?.users || coachesRes?.data || coachesRes?.users || coachesRes?.coaches || coachesRes;
        setCoaches(Array.isArray(rawCoaches) ? rawCoaches : []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (id: number | string, field: string, value: string) => {
    setData((prev) => prev.map((item) => ((item.id || item._id) === id ? { ...item, [field]: value } : item)));
  };

  const handleDrop = (e: React.DragEvent, targetDayShort: string) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    const targetDayFull = fullDayMap[targetDayShort] || targetDayShort;
    setData((prev) => prev.map((item) => ((item.id || item._id) === (draggedItem.id || draggedItem._id) ? { ...item, day: targetDayFull } : item)));
    setDraggedItem(null);
  };

  const handleSave = async (item: any) => {
    try {
      const targetId = item.id || item._id;
      if (!targetId) return showPopup("Error: Missing Team ID", "error");

      let finalCoachId = item.coach_id || item.coachId || item.coach?.id || item.coach?._id;

      if (item.coach_name) {
        const searchName = item.coach_name.toLowerCase().trim();
        const matchedCoach = coaches.find((c: any) => {
          const cName = `${c.first_name || ''} ${c.last_name || ''}`.trim().toLowerCase();
          const fallbackName = (c.name || '').trim().toLowerCase();
          return cName === searchName || fallbackName === searchName;
        });

        if (matchedCoach) {
          finalCoachId = matchedCoach.id || matchedCoach._id;
        }
      }

      if (!finalCoachId) {
        showPopup(`Failed! We couldn't find a Coach ID for "${item.coach_name}".`, "error");
        return;
      }

      const payload = {
        team_name: item.team_name,
        time: item.time,
        day: fullDayMap[item.day] || item.day,
        coach_id: Number(finalCoachId) 
      };

      if (TeamsAPI.update) {
        await TeamsAPI.update(targetId, payload);
        showPopup("Team updated successfully!", "success");
      } else {
        showPopup("TeamsAPI.update is not defined yet.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showPopup("Failed to update team.", "error");
    }
  };

  const cellMap: Record<string, any[]> = {};
  data.forEach((row) => {
    const dayShort = dayMap[row.day] ?? row.day;
    if (!cellMap[dayShort]) cellMap[dayShort] = [];
    cellMap[dayShort].push(row);
  });

  const displayRows = Math.max(5, Math.max(0, ...colDays.map((d) => cellMap[d]?.length ?? 0)));

  return (
    <main className="min-h-screen bg-[#fffef8] px-[5vw] py-[6vh] text-black max-md:px-[4vw]">
      <BackButton onClick={() => router.push("/manager/home")} />
      
      {/* ✅ Custom Popup (Top placement) */}
      {popup.show && (
        <div className={`fixed top-[5vh] left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full px-6 py-3 text-sm font-bold text-white shadow-xl transition-all duration-300 ease-out animate-in slide-in-from-top-5 ${popup.type === "success" ? "bg-[#108bad]" : "bg-red-600"}`}>
          {popup.type === "success" ? (
             <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
          ) : (
             <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          )}
          <span>{popup.message}</span>
        </div>
      )}

      <section className="mx-auto flex min-h-[88vh] w-full max-w-[920px] flex-col justify-center pt-12 md:pt-0">
        <h1 className="mb-[2.2vh] text-[clamp(16px,1.65vw,19px)] font-black text-[#108bad]">Edit the teams table</h1>
        <div className="relative overflow-x-auto overflow-y-hidden border border-[#9d9d9d] bg-white">
          <table className="relative z-10 h-[min(52vh,500px)] min-h-[355px] w-full min-w-[720px] table-fixed border-collapse bg-transparent text-center">
            <colgroup>
              <col className="w-[13.4%]" />
              {colDays.map((d) => <col key={d} />)}
            </colgroup>
            <thead>
              <tr>
                {days.map((day) => (
                  <th key={day} className="h-[44px] border border-[#9d9d9d] bg-white/45 text-[clamp(8px,0.82vw,11px)] font-black">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="py-10 text-center font-bold text-gray-400">Loading Teams...</td></tr>
              ) : (
                Array.from({ length: displayRows }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-[#9d9d9d] bg-white/35 px-[1.3vw] text-left text-[clamp(7px,0.72vw,10px)] font-bold leading-[1.7]">
                      <span className="block">Team name</span>
                      <span className="block">time</span>
                      <span className="block">coach name</span>
                    </td>
                    {colDays.map((day) => {
                      const item = cellMap[day]?.[rowIndex];
                      return (
                        <td 
                          key={`${day}-${rowIndex}`} 
                          className="border border-[#9d9d9d] bg-transparent p-1 align-top transition-colors hover:bg-gray-50"
                          onDragOver={(e) => e.preventDefault()} 
                          onDrop={(e) => handleDrop(e, day)}
                        >
                          {item ? (
                            <div key={item.id || item._id} className="flex flex-col gap-1 rounded bg-white p-1 shadow hover:shadow-md">
                              <div 
                                draggable 
                                onDragStart={(e) => { e.stopPropagation(); setDraggedItem(item); }}
                                className="cursor-grab active:cursor-grabbing rounded bg-[#108bad]/10 py-0.5 text-center text-[8px] font-black text-[#108bad] hover:bg-[#108bad]/20"
                                title="Drag to move to another day"
                              >
                                ✥ Drag
                              </div>
                              <input className="w-full rounded border bg-gray-50 p-0.5 text-center text-[clamp(7px,0.8vw,10px)] font-bold" value={item.team_name || ""} onChange={(e) => handleChange(item.id || item._id, "team_name", e.target.value)} />
                              <input className="w-full rounded border bg-gray-50 p-0.5 text-center text-[clamp(7px,0.8vw,10px)]" value={item.time || ""} onChange={(e) => handleChange(item.id || item._id, "time", e.target.value)} />
                              <input className="w-full rounded border bg-gray-50 p-0.5 text-center text-[clamp(7px,0.8vw,10px)]" value={item.coach_name || ""} onChange={(e) => handleChange(item.id || item._id, "coach_name", e.target.value)} placeholder="Coach Name" />
                              <button onClick={() => handleSave(item)} className="mt-1 rounded bg-[#108bad] py-0.5 text-[8px] text-white hover:bg-[#0d7c9a]">Save</button>
                            </div>
                          ) : (
                            <div className="h-full min-h-[60px] w-full"></div> 
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={() => router.push("/manager/home")} className="mx-auto mt-[4vh] min-h-[44px] w-[clamp(112px,13vw,135px)] rounded-full bg-[#108bad] text-[clamp(12px,1vw,13px)] font-black text-white shadow-[0_8px_16px_-12px_rgba(0,0,0,0.85)] transition hover:bg-[#0d7c9a]">Done</button>
      </section>
    </main>
  );
}

// ==========================================
// CLASSES TABLE SCREEN (EDIT MODE)
// ==========================================
export function ClassesTableScreen() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<any>(null); 
  const [popup, setPopup] = useState<{ show: boolean; message: string; type: "success" | "error" }>({ show: false, message: "", type: "success" });

  const showPopup = (message: string, type: "success" | "error" = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "success" }), 3000);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [classesRes, coachesRes] = await Promise.all([
          ClassesAPI.getAll().catch(() => null),
          CoachAPI.getList().catch(() => []),
        ]);
        const rawClasses = Array.isArray(classesRes) ? classesRes : classesRes?.data?.classes || classesRes?.data || [];
        setData(rawClasses);

        const rawCoaches = coachesRes?.data?.users || coachesRes?.data || coachesRes?.users || coachesRes?.coaches || coachesRes;
        setCoaches(Array.isArray(rawCoaches) ? rawCoaches : []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (id: number | string, field: string, value: string) => {
    setData((prev) => prev.map((item) => ((item.id || item._id) === id ? { ...item, [field]: value } : item)));
  };

  const handleDrop = (e: React.DragEvent, targetDayShort: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const targetDayFull = fullDayMap[targetDayShort] || targetDayShort;
    setData((prev) => prev.map((item) => ((item.id || item._id) === (draggedItem.id || draggedItem._id) ? { ...item, day: targetDayFull } : item)));
    setDraggedItem(null);
  };

  const handleSave = async (item: any) => {
    try {
      const targetId = item.id || item._id;
      if (!targetId) return showPopup("Error: Missing Class ID", "error");

      let finalCoachId = item.coach_id || item.coachId || item.coach?.id || item.coach?._id;

      if (item.coach_name) {
        const searchName = item.coach_name.toLowerCase().trim();
        const matchedCoach = coaches.find((c: any) => {
          const cName = `${c.first_name || ''} ${c.last_name || ''}`.trim().toLowerCase();
          const fallbackName = (c.name || '').trim().toLowerCase();
          return cName === searchName || fallbackName === searchName;
        });

        if (matchedCoach) {
          finalCoachId = matchedCoach.id || matchedCoach._id;
        }
      }

      if (!finalCoachId) {
        showPopup(`Failed! We couldn't find a Coach ID for "${item.coach_name}".`, "error");
        return;
      }

      const payload = {
        class_level: item.class_level,
        time: item.time,
        day: fullDayMap[item.day] || item.day,
        coach_id: Number(finalCoachId)
      };

      if (ClassesAPI.update) {
        await ClassesAPI.update(targetId, payload);
        showPopup("Class updated successfully!", "success");
      } else {
        showPopup("ClassesAPI.update is not defined yet.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showPopup("Failed to update class.", "error");
    }
  };

  const cellMap: Record<string, any[]> = {};
  data.forEach((row) => {
    const dayShort = dayMap[row.day] ?? row.day;
    if (!cellMap[dayShort]) cellMap[dayShort] = [];
    cellMap[dayShort].push(row);
  });

  const displayRows = Math.max(5, Math.max(0, ...colDays.map((d) => cellMap[d]?.length ?? 0)));

  return (
    <main className="min-h-screen bg-[#fffef8] px-[5vw] py-[6vh] text-black max-md:px-[4vw]">
      <BackButton onClick={() => router.push("/manager/home")} />

      {/* ✅ Custom Popup (Top placement) */}
      {popup.show && (
        <div className={`fixed top-[5vh] left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full px-6 py-3 text-sm font-bold text-white shadow-xl transition-all duration-300 ease-out animate-in slide-in-from-top-5 ${popup.type === "success" ? "bg-[#108bad]" : "bg-red-600"}`}>
          {popup.type === "success" ? (
             <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
          ) : (
             <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          )}
          <span>{popup.message}</span>
        </div>
      )}

      <section className="mx-auto flex min-h-[88vh] w-full max-w-[920px] flex-col justify-center pt-12 md:pt-0">
        <h1 className="mb-[2.2vh] text-[clamp(16px,1.65vw,19px)] font-black text-[#108bad]">Edit the classes table</h1>
        <div className="relative overflow-x-auto overflow-y-hidden border border-[#9d9d9d] bg-white">
          <table className="relative z-10 h-[min(52vh,500px)] min-h-[355px] w-full min-w-[720px] table-fixed border-collapse bg-transparent text-center">
            <colgroup>
              <col className="w-[13.4%]" />
              {colDays.map((d) => <col key={d} />)}
            </colgroup>
            <thead>
              <tr>
                {days.map((day) => (
                  <th key={day} className="h-[44px] border border-[#9d9d9d] bg-white/45 text-[clamp(8px,0.82vw,11px)] font-black">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="py-10 text-center font-bold text-gray-400">Loading Classes...</td></tr>
              ) : (
                Array.from({ length: displayRows }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-[#9d9d9d] bg-white/35 px-[1.3vw] text-left text-[clamp(7px,0.72vw,10px)] font-bold leading-[1.7]">
                      <span className="block">Class Level</span>
                      <span className="block">time</span>
                      <span className="block">coach name</span>
                    </td>
                    {colDays.map((day) => {
                      const item = cellMap[day]?.[rowIndex];
                      return (
                        <td 
                          key={`${day}-${rowIndex}`} 
                          className="border border-[#9d9d9d] bg-transparent p-1 align-top transition-colors hover:bg-gray-50"
                          onDragOver={(e) => e.preventDefault()} 
                          onDrop={(e) => handleDrop(e, day)}
                        >
                          {item ? (
                            <div key={item.id || item._id} className="flex flex-col gap-1 rounded bg-white p-1 shadow hover:shadow-md">
                              <div 
                                draggable 
                                onDragStart={(e) => { e.stopPropagation(); setDraggedItem(item); }}
                                className="cursor-grab active:cursor-grabbing rounded bg-[#108bad]/10 py-0.5 text-center text-[8px] font-black text-[#108bad] hover:bg-[#108bad]/20"
                                title="Drag to move to another day"
                              >
                                ✥ Drag
                              </div>
                              <input className="w-full rounded border bg-gray-50 p-0.5 text-center text-[clamp(7px,0.8vw,10px)] font-bold" value={item.class_level || ""} onChange={(e) => handleChange(item.id || item._id, "class_level", e.target.value)} />
                              <input className="w-full rounded border bg-gray-50 p-0.5 text-center text-[clamp(7px,0.8vw,10px)]" value={item.time || ""} onChange={(e) => handleChange(item.id || item._id, "time", e.target.value)} />
                              <input className="w-full rounded border bg-gray-50 p-0.5 text-center text-[clamp(7px,0.8vw,10px)]" value={item.coach_name || ""} onChange={(e) => handleChange(item.id || item._id, "coach_name", e.target.value)} placeholder="Coach Name" />
                              <button onClick={() => handleSave(item)} className="mt-1 rounded bg-[#108bad] py-0.5 text-[8px] text-white hover:bg-[#0d7c9a]">Save</button>
                            </div>
                          ) : (
                            <div className="h-full min-h-[60px] w-full"></div> 
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={() => router.push("/manager/home")} className="mx-auto mt-[4vh] min-h-[44px] w-[clamp(112px,13vw,135px)] rounded-full bg-[#108bad] text-[clamp(12px,1vw,13px)] font-black text-white shadow-[0_8px_16px_-12px_rgba(0,0,0,0.85)] transition hover:bg-[#0d7c9a]">Done</button>
      </section>
    </main>
  );
}