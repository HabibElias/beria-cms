import type { LoanRequest } from "../models/Library";

export function RequestStatusLabel({ request }: { request: LoanRequest }) {
  const labels = {
    pending: "Awaiting review",
    approved: request.checkout ? "On loan" : "Returned",
    declined: "Declined",
    cancelled: "Cancelled",
  };
  return (
    <span
      className={`status-label ${request.status === "pending" ? "gold" : request.status === "declined" ? "red" : ""}`}
    >
      {labels[request.status]}
    </span>
  );
}
