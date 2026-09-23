import Link from "next/link";
import { FileText, Settings2, UploadCloud } from "lucide-react";
export default function QuickActions() {
  return <div className="card"><div className="card-head"><div className="card-title">Quick actions</div></div><div className="card-body quick-grid">
    <Link className="quick" href="/assignments/new"><div className="quick-icon"><UploadCloud size={18}/></div><div><strong>Create evaluation</strong><span>Upload question, model answer and rubric</span></div></Link>
    <Link className="quick" href="/assignments"><div className="quick-icon"><FileText size={18}/></div><div><strong>Review assignments</strong><span>Open results and instructor feedback</span></div></Link>
    <Link className="quick" href="/settings"><div className="quick-icon"><Settings2 size={18}/></div><div><strong>Evaluation rules</strong><span>Configure your default marking behavior</span></div></Link>
  </div></div>;
}