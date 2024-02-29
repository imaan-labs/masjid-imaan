import SubmissionListAccess from "@/components/registrations/bayyan/SubmissionListAccess";
import { prisma } from "@/prisma";
import { useState } from "react";

export default async function BayyanForm() {
  const PASSWORD = process.env["BAYYAN_03_24_PASSWORD"]!;
  const data = await prisma.khatiraEventRSVP.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <SubmissionListAccess data={data} password={PASSWORD} />
    </div>
  );
}
