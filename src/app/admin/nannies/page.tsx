"use client";

import { useState, useEffect, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Badge, VerificationBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { sampleNannies } from "@/lib/data/sample-nannies";
import {
  NANNY_STATUS_LABELS,
  VERIFICATION_LEVEL_LABELS,
  VERIFICATION_LEVEL_ORDER,
  SAFETY_CHECKS,
  SAFETY_CHECK_STATUS_LABELS,
  SAFETY_CHECK_STATUSES,
} from "@/lib/constants";
import type { VerificationLevel, SafetyCheckStatus, DocumentType } from "@/lib/constants";
import { formatRate } from "@/lib/utils";
import {
  MapPin, Eye, CheckCircle, XCircle, ChevronDown, ChevronUp,
  FileText, Shield, ThumbsUp, ThumbsDown, Loader2, Info, Mail, Phone,
  Download,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { pickImages } from "@/lib/images";
import {
  getAdminNannies,
  updateNannyStatus,
  updateVerificationLevel,
  reviewDocument,
  updateSafetyCheckStatus,
  getDocumentDownloadUrl,
} from "@/server/actions/admin";

const statusOptions = Object.entries(NANNY_STATUS_LABELS).map(([value, label]) => ({ value, label }));
const verificationOptions = VERIFICATION_LEVEL_ORDER.map((v) => ({ value: v, label: VERIFICATION_LEVEL_LABELS[v] }));

interface DocumentData {
  id: string;
  documentType: string;
  fileName: string;
  fileUrl: string | null;
  reviewStatus: string;
  createdAt: any;
}

interface MappedNanny {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  suburb: string;
  hourlyRate: number;
  verificationLevel: string;
  adminStatus: string;
  eceExperience: boolean;
  neurodiverseExperience: boolean;
  firstAidCurrent: boolean;
  driverLicence: boolean;
  bio: string;
  refereeData: string;
  image: string;
  // Safety checks
  identityVerified: string;
  workHistoryVerified: string;
  proRegVerified: string;
  refereeCheckStatus: string;
  policeVetStatus: string;
  interviewStatus: string;
  riskAssessmentStatus: string;
  documents: DocumentData[];
}

export default function AdminNanniesPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedNannyId, setExpandedNannyId] = useState<string | null>(null);
  const [nannies, setNannies] = useState<MappedNanny[]>([]);

  const fetchNannies = async () => {
    setLoading(true);
    try {
      const res = await getAdminNannies();
      if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((n: any) => ({
          id: n.id,
          userId: n.userId,
          name: n.user?.name || "No name",
          email: n.user?.email || "",
          phone: n.user?.phone || null,
          suburb: n.suburb,
          hourlyRate: n.hourlyRate,
          verificationLevel: n.verificationLevel,
          adminStatus: n.adminStatus,
          eceExperience: n.eceExperience,
          neurodiverseExperience: n.neurodiverseExperience,
          firstAidCurrent: n.firstAidCurrent,
          driverLicence: n.driverLicence,
          bio: n.bio,
          refereeData: n.refereeData,
          image: n.profileImageUrl || pickImages({ tags: ["professional", "care", "find"], seed: n.id })[0].src,
          identityVerified: n.identityVerified || "NOT_STARTED",
          workHistoryVerified: n.workHistoryVerified || "NOT_STARTED",
          proRegVerified: n.proRegVerified || "NOT_STARTED",
          refereeCheckStatus: n.refereeCheckStatus || "NOT_STARTED",
          policeVetStatus: n.policeVetStatus || "NOT_STARTED",
          interviewStatus: n.interviewStatus || "NOT_STARTED",
          riskAssessmentStatus: n.riskAssessmentStatus || "NOT_STARTED",
          documents: n.documents || [],
        }));
        setNannies(mapped);
      } else {
        // Fallback to sample data for local demo mode if database is empty/unconfigured
        console.log("No nannies found in database, using mock sample nannies");
        const mockMapped = sampleNannies.map((n, index) => ({
          id: n.id,
          userId: `mock-user-${index}`,
          name: n.name,
          email: `${n.name.toLowerCase().replace(/ /g, ".")}@example.com`,
          phone: "021 555 1234",
          suburb: n.suburb,
          hourlyRate: n.hourlyRate,
          verificationLevel: n.verificationLevel,
          adminStatus: "APPROVED",
          eceExperience: true,
          neurodiverseExperience: true,
          firstAidCurrent: true,
          driverLicence: true,
          bio: n.bio,
          refereeData: "[]",
          image: n.profileImageUrl || pickImages({ tags: ["professional", "care", "find"], seed: n.id })[0].src,
          identityVerified: "VERIFIED",
          workHistoryVerified: "VERIFIED",
          proRegVerified: "VERIFIED",
          refereeCheckStatus: "VERIFIED",
          policeVetStatus: "VERIFIED",
          interviewStatus: "VERIFIED",
          riskAssessmentStatus: "VERIFIED",
          documents: [
            {
              id: `mock-doc-${index}-1`,
              documentType: "ID",
              fileName: `${n.name.toLowerCase().replace(/ /g, "-")}-passport.pdf`,
              fileUrl: null,
              reviewStatus: "APPROVED",
              createdAt: new Date(),
            },
          ],
        }));
        setNannies(mockMapped);
      }
    } catch (err) {
      console.error("Failed to load admin nannies:", err);
      toast("Error loading nannies from database", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNannies();
  }, []);

  const handleStatusChange = async (nannyId: string, newStatus: string) => {
    startTransition(async () => {
      try {
        const res = await updateNannyStatus(nannyId, newStatus);
        if (res.success) {
          setNannies((prev) =>
            prev.map((n) => (n.id === nannyId ? { ...n, adminStatus: newStatus } : n))
          );
          toast(`Nanny status updated to ${NANNY_STATUS_LABELS[newStatus as keyof typeof NANNY_STATUS_LABELS] || newStatus}`, "success");
        } else {
          toast(res.error || "Failed to update nanny status", "error");
        }
      } catch (err) {
        toast("An error occurred.", "error");
      }
    });
  };

  const handleVerificationLevelChange = async (nannyId: string, level: VerificationLevel) => {
    startTransition(async () => {
      try {
        const res = await updateVerificationLevel(nannyId, level);
        if (res.success) {
          setNannies((prev) =>
            prev.map((n) => (n.id === nannyId ? { ...n, verificationLevel: level } : n))
          );
          toast(`Verification level updated to ${VERIFICATION_LEVEL_LABELS[level]}`, "success");
        } else {
          toast(res.error || "Failed to update verification level", "error");
        }
      } catch {
        toast("An error occurred.", "error");
      }
    });
  };

  const handleDocumentReview = async (nannyId: string, docId: string, status: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      try {
        const res = await reviewDocument(docId, status);
        if (res.success) {
          setNannies((prev) =>
            prev.map((n) => {
              if (n.id === nannyId) {
                return {
                  ...n,
                  documents: n.documents.map((d) => (d.id === docId ? { ...d, reviewStatus: status } : d)),
                };
              }
              return n;
            })
          );
          toast(`Document ${status === "APPROVED" ? "approved" : "rejected"} successfully`, "success");
        } else {
          toast(res.error || "Failed to review document", "error");
        }
      } catch {
        toast("An error occurred.", "error");
      }
    });
  };

  const handleSafetyCheckStatusChange = async (nannyId: string, checkKey: string, newStatus: SafetyCheckStatus) => {
    startTransition(async () => {
      try {
        const res = await updateSafetyCheckStatus(nannyId, checkKey, newStatus);
        if (res.success) {
          setNannies((prev) =>
            prev.map((n) => (n.id === nannyId ? { ...n, [checkKey]: newStatus } : n))
          );
          toast("Safety check status updated", "success");
        } else {
          toast(res.error || "Failed to update safety check", "error");
        }
      } catch {
        toast("An error occurred.", "error");
      }
    });
  };

  const handleDownload = async (docId: string, fileName: string) => {
    startTransition(async () => {
      try {
        const res = await getDocumentDownloadUrl(docId);
        if (res.success && res.data?.url) {
          window.open(res.data.url, "_blank", "noopener,noreferrer");
        } else {
          toast(res.error || "Unable to download file.", "error");
        }
      } catch {
        toast("An error occurred while fetching the file.", "error");
      }
    });
  };

  const filtered = statusFilter ? nannies.filter((n) => n.adminStatus === statusFilter) : nannies;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground text-sm font-semibold">Loading nanny applications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Nanny Management</h1>
          <p className="text-muted-foreground mt-1">{filtered.length} applications filtered ({nannies.length} total)</p>
        </div>
        <div className="w-48">
          <Select
            options={[{ value: "", label: "All Statuses" }, ...statusOptions]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="p-8 text-center bg-card">
            <Info className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No nanny applications found matching the selected filters.</p>
          </Card>
        ) : (
          filtered.map((nanny) => {
            const isExpanded = expandedNannyId === nanny.id;
            const checksDone = [
              nanny.identityVerified, nanny.workHistoryVerified, nanny.proRegVerified,
              nanny.refereeCheckStatus, nanny.policeVetStatus, nanny.interviewStatus, nanny.riskAssessmentStatus,
            ].filter((s) => s === "VERIFIED").length;
            return (
              <Card key={nanny.id} className="flex flex-col gap-4 overflow-hidden bg-card rounded-3xl border-border/40 hover:shadow-md transition-all">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-secondary">
                      <Image src={nanny.image} alt={nanny.name} fill className="object-cover" sizes="64px" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-bold text-foreground truncate">{nanny.name}</h3>
                        <VerificationBadge level={nanny.verificationLevel as VerificationLevel} />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                        <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-primary" />{nanny.suburb}</span>
                        <span>·</span>
                        <span className="text-primary font-bold">{formatRate(nanny.hourlyRate)}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5 truncate"><Mail className="w-3 h-3" />{nanny.email}</span>
                        {nanny.phone && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-0.5"><Phone className="w-3 h-3" />{nanny.phone}</span>
                          </>
                        )}
                      </div>
                      {/* verification progress */}
                      <div className="flex items-center gap-2 mt-2 max-w-xs">
                        <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent origin-left animate-[grow-x_0.9s_cubic-bezier(0.16,1,0.3,1)_both]"
                            style={{ width: `${(checksDone / 7) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">{checksDone}/7 checks</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 sm:flex-shrink-0">
                    {/* Verification Level Dropdown */}
                    <div className="w-36">
                      <Select
                        options={verificationOptions}
                        value={nanny.verificationLevel}
                        onChange={(e) => handleVerificationLevelChange(nanny.id, e.target.value as VerificationLevel)}
                        disabled={isPending}
                        className="h-8 py-0.5 text-xs rounded-xl"
                      />
                    </div>
                    <Badge variant="outline" className="px-2 py-1 rounded-lg text-xs font-semibold bg-secondary/50">
                      {NANNY_STATUS_LABELS[nanny.adminStatus as keyof typeof NANNY_STATUS_LABELS] || nanny.adminStatus}
                    </Badge>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="border-t border-border/30 pt-4 space-y-5 animate-fade-in text-xs sm:text-sm">
                    {/* Bio */}
                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground uppercase tracking-wider text-xs">Carer Bio</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed bg-secondary/20 p-3.5 rounded-2xl border border-border/40">
                        {nanny.bio || "No biography provided."}
                      </p>
                    </div>

                    {/* Safety Vetting Grid */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-foreground uppercase tracking-wider text-xs flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-primary" />
                        Vetting Checks Audit (7 Checks)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {SAFETY_CHECKS.map((check) => {
                          const status = (nanny[check.key as keyof MappedNanny] || "NOT_STARTED") as SafetyCheckStatus;
                          return (
                            <div key={check.key} className="flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-secondary/10">
                              <div className="min-w-0 mr-4">
                                <p className="font-bold text-foreground text-xs">{check.number}. {check.title}</p>
                                <p className="text-[10px] text-muted-foreground truncate max-w-xs">{check.description}</p>
                              </div>
                              <div className="w-36 flex-shrink-0">
                                <Select
                                  options={Object.entries(SAFETY_CHECK_STATUS_LABELS)
                                    .filter(([value]) => value !== "NOT_APPLICABLE" || check.key === "proRegVerified")
                                    .map(([value, label]) => ({ value, label }))}
                                  value={status}
                                  onChange={(e) => handleSafetyCheckStatusChange(nanny.id, check.key, e.target.value as SafetyCheckStatus)}
                                  disabled={isPending}
                                  className="h-8 py-0.5 pl-3 pr-8 text-xs rounded-xl"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Vetting Documents Review */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-foreground uppercase tracking-wider text-xs flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-accent" />
                        Uploaded Vetting Documents
                      </h4>
                      {nanny.documents && nanny.documents.length > 0 ? (
                        <div className="space-y-2">
                          {nanny.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-white">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="font-bold text-foreground text-xs truncate">{doc.fileName}</p>
                                  <p className="text-[10px] text-muted-foreground">
                                    Type: {doc.documentType} · Status: <span className="font-bold">{doc.reviewStatus}</span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownload(doc.id, doc.fileName)}
                                  disabled={isPending}
                                  className="h-7 w-7 p-0 text-primary hover:bg-primary/10"
                                  title={`Download / view ${doc.fileName}`}
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </Button>
                                {doc.reviewStatus !== "APPROVED" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDocumentReview(nanny.id, doc.id, "APPROVED")}
                                    disabled={isPending}
                                    className="h-7 w-7 p-0 text-badge-verified hover:bg-emerald-50"
                                    title="Approve Document"
                                  >
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                  </Button>
                                )}
                                {doc.reviewStatus !== "REJECTED" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDocumentReview(nanny.id, doc.id, "REJECTED")}
                                    disabled={isPending}
                                    className="h-7 w-7 p-0 text-destructive hover:bg-red-50"
                                    title="Reject Document"
                                  >
                                    <ThumbsDown className="w-3.5 h-3.5" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic bg-secondary/10 p-3 rounded-xl border border-dashed border-border/40">
                          No documents uploaded yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer action buttons */}
                <div className="flex items-center justify-between border-t border-border/20 pt-3.5 w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedNannyId(isExpanded ? null : nanny.id)}
                    className="text-primary hover:text-primary-light font-semibold text-xs flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>Hide Details <ChevronUp className="w-3.5 h-3.5" /></>
                    ) : (
                      <>Review Vetting & Documents ({nanny.documents?.length || 0}) <ChevronDown className="w-3.5 h-3.5" /></>
                    )}
                  </Button>

                  <div className="flex items-center gap-1.5">
                    {nanny.adminStatus !== "APPROVED" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-badge-verified hover:text-badge-verified flex items-center gap-1 text-xs"
                        onClick={() => handleStatusChange(nanny.id, "APPROVED")}
                        disabled={isPending}
                      >
                        <CheckCircle className="w-4 h-4" aria-hidden="true" />
                        Approve Application
                      </Button>
                    )}
                    {nanny.adminStatus !== "SUSPENDED" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive flex items-center gap-1 text-xs"
                        onClick={() => handleStatusChange(nanny.id, "SUSPENDED")}
                        disabled={isPending}
                      >
                        <XCircle className="w-4 h-4" aria-hidden="true" />
                        Suspend Profile
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
