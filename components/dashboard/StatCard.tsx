import { LucideIcon } from "lucide-react";
export default function StatCard({label,value,foot,icon:Icon}:{label:string;value:string|number;foot:string;icon:LucideIcon}) {
  return <div className="card stat-card"><div className="stat-top"><span className="stat-label">{label}</span><div className="stat-icon"><Icon size={18}/></div></div><div className="stat-value">{value}</div><div className="stat-foot">{foot}</div></div>;
}