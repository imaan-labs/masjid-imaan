import SubmissionListAccess from "@/components/registrations/bayyan/SubmissionListAccess";
import { prisma } from "@/prisma";
import { useState } from "react";

export default async function BayyanForm() {
  const PASSWORD = "asdiuje129j12wjk";
  const data = await prisma.khatiraEventRSVP.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <SubmissionListAccess data={data} password={PASSWORD} />
    </div>
  );
}
