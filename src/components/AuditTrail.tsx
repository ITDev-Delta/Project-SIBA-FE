interface IAuditTrail {
  id: number;
  event: string;
  table_name: string;
  record_id: string;
  old_data: null | Record<string, any>;
  new_data: {
    nomor_consume: string;
    tanggal_consume: string;
    status: string;
    departemen_id: number;
    note: null | string;
    created_by: string;
    updated_at: string;
    created_at: string;
    id: number;
  };
  user: string;
  created_at: string;
  updated_at: string;
}

interface props {
  AuditTrailData: any[];
}

const AuditTrail: React.FC<props> = ({ AuditTrailData }) => {
  const AuditItem = (audit: IAuditTrail) => {
    const dateTime = new Date(audit.created_at).toLocaleDateString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default mb-4">
        <div className="user-info items-center  p-4">
          <p className="font-semibold mb-2">
            {audit.user} {audit.event} {"at "}
            {audit.table_name
              .replace(/_/g, " ")
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </p>
          <p className="text-sm text-gray-500">{dateTime}</p>
        </div>
        <div className="ml-6">
          {audit.event !== "created" && (
            <div className="mx-4 mb-4">
              <ul className="text-sm">
                {Object.entries(audit?.new_data ?? {}).map(([key, value]) => {
                  if (key.endsWith("_id")) return null;
                  if (key === "updated_at") return null;
                  if (key === "updated_by") return null;
                  let displayValue = value?.toString();
                  let oldValue =
                    (audit.old_data as Record<string, any>)[key] ?? "-";

                  let displayKey = key
                    .replace(/_/g, " ")
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());
                  if (key === "is_active") {
                    displayValue = value == "1" ? "Active" : "Inactive";
                    oldValue = oldValue == "1" ? "Active" : "Inactive";
                    displayKey = "Status";
                  }

                  return (
                    <li
                      key={key}
                      className={
                        displayValue === "Active"
                          ? "text-green-600"
                          : displayValue === "Inactive"
                          ? "text-red-600"
                          : ""
                      }
                    >
                      <span
                        key={key}
                        className={
                          oldValue === "Active"
                            ? "text-green-600"
                            : oldValue === "Inactive"
                            ? "text-red-600"
                            : ""
                        }
                      >
                        {`"${oldValue}" `}
                      </span>
                      <span className="text-gray-500">{" → "}</span>
                      {`"${displayValue}" `}{" "}
                      <span className="text-gray-500">({displayKey})</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div key={"ContentAuditTrail"}>
      <div className="rounded-sm border border-stroke bg-white shadow-defaultp-5 mt-10">
        <p className="text-title-s font-semibold text-black">Audit Trail</p>
        <div className="audit-trail-list mt-5">
          {AuditTrailData.slice()
            .reverse()
            .map((item) => AuditItem(item))}
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
