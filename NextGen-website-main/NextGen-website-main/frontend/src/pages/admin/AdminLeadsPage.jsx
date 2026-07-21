import { useEffect, useState } from "react";
import { Trash2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const STATUS_OPTIONS = ["new", "contacted", "qualified", "closed"];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const { data } = await api.get("/leads");
      setLeads(data);
    } catch {
      toast.error("Could not load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/leads/${id}`, { status });
      setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
      toast.success("Status updated");
    } catch {
      toast.error("Could not update status");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      await api.delete(`/leads/${id}`);
      setLeads((ls) => ls.filter((l) => l.id !== id));
      toast.success("Lead removed");
    } catch {
      toast.error("Could not delete");
    }
  };

  const visible = filter === "all" ? leads : leads.filter((l) => l.status === filter);
  const counts = STATUS_OPTIONS.reduce((acc, s) => ({ ...acc, [s]: leads.filter((l) => l.status === s).length }), {});

  return (
    <div className="p-8 lg:p-12" data-testid="admin-leads-page">
      <div className="flex items-baseline justify-between mb-10">
        <div>
          <div className="ngi-overline mb-2"><span className="ngi-rule" />Inbox</div>
          <h1 className="font-serif text-4xl md:text-5xl font-light">Leads</h1>
        </div>
        <div className="text-sm text-[#1E1E1E]/70">{leads.length} total</div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {["all", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            data-testid={`leads-filter-${s}`}
            className={`text-[10px] tracking-[0.22em] uppercase px-4 py-2.5 transition-colors ${
              filter === s ? "bg-[#171717] text-white" : "border border-[#171717]/20 hover:border-[#171717]"
            }`}
          >
            {s} {s !== "all" && <span className="ml-1 opacity-60">({counts[s] || 0})</span>}
          </button>
        ))}
      </div>

      <div className="border-t border-b border-[#171717]/10 divide-y divide-[#171717]/10">
        {loading ? (
          <p className="py-12 text-center text-[#1E1E1E]/60">Loading…</p>
        ) : visible.length === 0 ? (
          <p className="py-12 text-center text-[#1E1E1E]/60">No leads to show.</p>
        ) : (
          visible.map((lead) => (
            <div key={lead.id} className="py-6 grid grid-cols-12 gap-4 items-start" data-testid={`lead-row-${lead.id}`}>
              <div className="col-span-3">
                <div className="font-serif text-xl">{lead.name}</div>
                <div className="text-xs text-[#1E1E1E]/60 mt-1">{new Date(lead.created_at).toLocaleString("en-IN")}</div>
                <div className="text-[10px] tracking-[0.22em] uppercase text-[#707070] mt-2">via {lead.source}</div>
              </div>
              <div className="col-span-3 text-sm space-y-1">
                <a href={`mailto:${lead.email}`} className="flex items-center gap-2 ngi-link-underline"><Mail size={12} />{lead.email}</a>
                <a href={`tel:${lead.phone}`} className="flex items-center gap-2 ngi-link-underline"><Phone size={12} />{lead.phone}</a>
              </div>
              <div className="col-span-3 text-sm">
                {lead.project_type && <div><span className="text-[#707070]">Project:</span> {lead.project_type}</div>}
                {lead.budget && <div><span className="text-[#707070]">Budget:</span> {lead.budget}</div>}
                {lead.timeline && <div><span className="text-[#707070]">Timeline:</span> {lead.timeline}</div>}
                {lead.location && <div><span className="text-[#707070]">Location:</span> {lead.location}</div>}
                {lead.message && <p className="mt-2 text-[#1E1E1E]/75 italic">"{lead.message}"</p>}
              </div>
              <div className="col-span-2">
                <select
                  value={lead.status}
                  onChange={(e) => updateStatus(lead.id, e.target.value)}
                  data-testid={`lead-status-${lead.id}`}
                  className="bg-white border border-[#E7E2DA] focus:border-[#C8A46A] px-3 py-2 text-[10px] tracking-[0.22em] uppercase w-full"
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-1 text-right">
                <button onClick={() => remove(lead.id)} data-testid={`lead-delete-${lead.id}`} className="text-[#1E1E1E]/40 hover:text-red-700 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
