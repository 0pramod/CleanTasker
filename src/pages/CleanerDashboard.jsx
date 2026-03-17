import { useMemo } from "react";
import Badge from "../ui/Badge.jsx";
import { PrimaryButton, SmallButton } from "../ui/Filters.jsx";

export default function CleanerDashboard() {
  const cleaner = {
    name: "Alex",
    dateLabel: "Today • Mon, 11 Mar",
    shift: {
      site: "Central Plaza",
      start: "8:00 AM",
      end: "4:00 PM",
      supervisor: "Brian Holmes",
      status: "Checked In",
    },
    tasks: [
      {
        id: 1,
        title: "Vacuum lobby",
        location: "Ground Floor",
        time: "8:30 AM",
        priority: "High",
        status: "In Progress",
      },
      {
        id: 2,
        title: "Clean washrooms",
        location: "Level 2",
        time: "10:00 AM",
        priority: "Medium",
        status: "Pending",
      },
      {
        id: 3,
        title: "Restock supplies",
        location: "Storage Room",
        time: "11:30 AM",
        priority: "Low",
        status: "Pending",
      },
      {
        id: 4,
        title: "Mop reception",
        location: "Front Desk",
        time: "1:00 PM",
        priority: "High",
        status: "Completed",
      },
    ],
  };

  const stats = useMemo(() => {
    const total = cleaner.tasks.length;
    const completed = cleaner.tasks.filter((t) => t.status === "Completed").length;
    const inProgress = cleaner.tasks.filter((t) => t.status === "In Progress").length;
    const pending = cleaner.tasks.filter((t) => t.status === "Pending").length;

    return {
      total,
      completed,
      inProgress,
      pending,
      progress: Math.round((completed / Math.max(1, total)) * 100),
    };
  }, [cleaner.tasks]);

  return (
    <div className="min-h-screen bg-pagebg">
      <div className="mx-auto w-full max-w-[430px] px-4 py-4">
        {/* Header */}
        <div className="mb-4 rounded-2xl bg-nav px-4 py-4 text-white shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-white/70">{cleaner.dateLabel}</div>
              <h1 className="mt-1 text-2xl font-semibold">Good morning, {cleaner.name}</h1>
              <p className="mt-1 text-sm text-white/75">Here’s your cleaner view for today.</p>
            </div>

            <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-sm font-semibold text-nav">
              {cleaner.name.slice(0, 1).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <MiniCard title="Tasks Today" value={stats.total} sub="Assigned for today" />
          <MiniCard title="Completed" value={stats.completed} sub={`${stats.progress}% done`} />
          <MiniCard title="Pending" value={stats.pending} sub="Still left today" />
          <MiniCard title="In Progress" value={stats.inProgress} sub="Currently active" />
        </div>

        {/* Shift card */}
        <section className="mb-4 rounded-2xl border border-line bg-white p-4 shadow-soft">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">My Shift</h2>
              <p className="text-sm text-slate-500">Today’s assigned shift</p>
            </div>
            <Badge variant="good">{cleaner.shift.status}</Badge>
          </div>

          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Site</span>
              <span className="font-semibold">{cleaner.shift.site}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Time</span>
              <span className="font-semibold">
                {cleaner.shift.start} - {cleaner.shift.end}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Supervisor</span>
              <span className="font-semibold">{cleaner.shift.supervisor}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <PrimaryButton>Start Shift</PrimaryButton>
            <SmallButton>Report Issue</SmallButton>
          </div>
        </section>

        {/* Progress card */}
        <section className="mb-4 rounded-2xl border border-line bg-white p-4 shadow-soft">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Today’s Progress</h2>
              <p className="text-sm text-slate-500">Quick personal overview</p>
            </div>
            <div className="text-lg font-bold text-nav">{stats.progress}%</div>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand transition-all"
              style={{ width: `${stats.progress}%` }}
            />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <StatPill label="Done" value={stats.completed} />
            <StatPill label="Active" value={stats.inProgress} />
            <StatPill label="Left" value={stats.pending} />
          </div>
        </section>

        {/* Tasks list */}
        <section className="mb-4 rounded-2xl border border-line bg-white p-4 shadow-soft">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Today’s Tasks</h2>
              <p className="text-sm text-slate-500">Your assigned work items</p>
            </div>
            <button className="text-sm font-semibold text-nav">View all</button>
          </div>

          <div className="space-y-3">
            {cleaner.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section className="rounded-2xl border border-line bg-white p-4 shadow-soft">
          <h2 className="text-base font-semibold text-slate-900">Quick Actions</h2>
          <p className="mb-3 text-sm text-slate-500">Fast access to common actions</p>

          <div className="grid grid-cols-2 gap-3">
            <ActionButton label="My Tasks" />
            <ActionButton label="Mark Complete" />
            <ActionButton label="Break Start" />
            <ActionButton label="Contact Supervisor" />
          </div>
        </section>
      </div>
    </div>
  );
}

function MiniCard({ title, value, sub }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
      <div className="text-sm font-semibold text-slate-600">{title}</div>
      <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{sub}</div>
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <div className="text-lg font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function TaskCard({ task }) {
  return (
    <div className="rounded-xl border border-line p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">{task.title}</div>
          <div className="mt-1 text-xs text-slate-500">
            {task.location} • {task.time}
          </div>
        </div>

        <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>

        <button className="text-sm font-semibold text-nav">Open</button>
      </div>
    </div>
  );
}

function ActionButton({ label }) {
  return (
    <button className="rounded-xl border border-line bg-slate-50 px-3 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-100">
      {label}
    </button>
  );
}

function statusVariant(status) {
  if (status === "Completed") return "good";
  if (status === "In Progress") return "info";
  if (status === "Pending") return "warn";
  return "neutral";
}

function priorityVariant(priority) {
  if (priority === "High") return "bad";
  if (priority === "Medium") return "warn";
  if (priority === "Low") return "good";
  return "neutral";
}