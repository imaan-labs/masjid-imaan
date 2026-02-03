import SubmissionListAccess from "@/components/registrations/bayan/SubmissionListAccess";
import { prisma } from "@/prisma";
import { useState } from "react";

export default async function BayyanForm() {
  // const PASSWORD = process.env["BAYYAN_03_24_PASSWORD"]!;
  // const data = await prisma.khatiraEventRSVP.findMany({
  //   orderBy: { name: "asc" },
  // });

  // if (!PASSWORD) throw new Error("Invalid Password");

  // return (
  //   <div>
  //     <SubmissionListAccess data={[]} password={PASSWORD} />
  //   </div>
  // );

  return <div><p>You do not have permission to access this page. Please contact an admin.</p></div>
}
