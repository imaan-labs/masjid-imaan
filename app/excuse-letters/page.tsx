import Footer from "@/components/ui/footer";
import ExcuseLetters from "@/src/components/ExcuseLetters";

export const metadata = {
  title: "Excuse Letters | Imaan Masjid",
  description:
    "Create a printable Imaan Masjid excuse letter for Eid al-Fitr, Eid al-Adha, Jumu'ah, Ramadan, or Umrah.",
};

export default function ExcuseLettersPage() {
  return (
    <>
      <ExcuseLetters />
      <div className="no-print">
        <Footer />
      </div>
    </>
  );
}
