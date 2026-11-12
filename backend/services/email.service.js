const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: (process.env.SMTP_PORT || "465") === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function formatoLek(vlera) {
  const numri = Math.round(Number(vlera) || 0);
  return `${String(numri).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} Lekë`;
}

async function dergoKonfirmimTakimi({
  email,
  emriKlientit,
  emriDermatologut,
  data,
  ora,
  sherbimet = [],
  cmimiTotal = 0,
  kohezgjatjaTotal = 0,
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP_USER/SMTP_PASS mungojnë në .env");
  }

  if (!email) {
    throw new Error("Klienti nuk ka adresë emaili.");
  }

  const dataFormatuar = new Date(data).toLocaleDateString("sq-AL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const listaSherbimeve = sherbimet.length
    ? sherbimet
        .map(
          (s) => `
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #e5e5e5">
                ${String(s).replace(/\s*€/g, "")}
              </td>
            </tr>
          `,
        )
        .join("")
    : "<tr><td>Nuk ka shërbime të specifikuara.</td></tr>";

  await transporter.sendMail({
    from: `"SkinCaring" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Takimi yt u rezervua me sukses",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#222;padding:20px">

        <h2 style="color:#1f4d3a">
          Takimi u rezervua me sukses!
        </h2>

        <p>Përshëndetje ${emriKlientit},</p>

        <p>
          Takimi yt me dermatologun
          <b>${emriDermatologut}</b>
          u regjistrua me sukses.
        </p>

        <div style="background:#f3efe6;padding:18px;border-radius:12px;margin:20px 0">

          <h3 style="color:#1f4d3a;margin-top:0">
            Detajet e takimit
          </h3>

          <p>
            <b>Data:</b> ${dataFormatuar}
          </p>

          <p>
            <b>Ora:</b> ${ora}
          </p>

          <p>
            <b>Kohëzgjatja totale:</b> ${kohezgjatjaTotal} minuta
          </p>

          <hr style="border:none;border-top:1px solid #ddd;margin:16px 0"/>

          <h3 style="color:#1f4d3a">
            Shërbimet e rezervuara
          </h3>

          <table style="width:100%;border-collapse:collapse">
            ${listaSherbimeve}
          </table>

          <div style="border-top:1px solid #ddd;margin-top:16px;padding-top:14px">
            <p style="font-size:17px;margin:0">
              <b>Çmimi total:</b>
              <span style="color:#1f4d3a;font-weight:bold">
                ${formatoLek(cmimiTotal)}
              </span>
            </p>
          </div>

        </div>

        <p>
          Faleminderit që zgjodhe SkinCaring!
        </p>

        <p style="color:#777;font-size:12px">
          Ky është një email automatik konfirmimi.
        </p>

      </div>
    `,
  });

  console.log(`Email u dërgua te klienti: ${email}`);
}

module.exports = { dergoKonfirmimTakimi };
