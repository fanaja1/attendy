import { File, Paths } from 'expo-file-system';
import * as XLSX from 'xlsx';
import * as Sharing from 'expo-sharing';
import { DateEntry, Member, Presence } from '../types/models';

// Convert base64 string to Uint8Array
const base64ToUint8Array = (base64: string) => {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

export const handleExportXLSX = async (
  dates: DateEntry[],
  members: Member[],
  presenceMap: Record<string, Presence[]>
) => {
  try {
    const header = ["Name", ...dates.map(d => d.value)];

    const data = members.map(member => {
      const row: any[] = [];
      row.push(`${member.firstName} ${member.lastName ?? ""}`.trim());
      dates.forEach(dateEntry => {
        const presence = presenceMap[member.id]?.find(p => p.date === dateEntry.value);
        let symbol = "❌";
        if (presence) {
          if (presence.status === "present") symbol = "✔️";
          else if (presence.status === "retard") symbol = `⏰${presence.retardMinutes}`;
          else if (presence.status === "permission") symbol = "📝";
          else if (presence.status === "absent") symbol = "❌";
        }
        row.push(symbol);
      });
      return row;
    });

    const worksheetData = [header, ...data];
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Presence");

    // Générer XLSX en base64
    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
    const wbBytes = base64ToUint8Array(wbout);

    // Créer le fichier
    const file = new File(Paths.document, "presence.xlsx");

    if (file.exists) {
      file.delete();
    }

    file.create();
    file.write(wbBytes); // <-- écrire en binaire

    console.log("✅ Export XLSX réussi !");
    console.log("📂 Fichier sauvegardé ici :", file.uri);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri);
    } else {
      console.warn("Le partage n'est pas disponible sur cet appareil");
    }

  } catch (error) {
    console.error("❌ Erreur lors de l'export XLSX :", error);
  }
};
