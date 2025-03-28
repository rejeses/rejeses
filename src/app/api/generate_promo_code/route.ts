import { generatePromoCode } from "@/app/services/repository/promocode/promocode";
import fs from "fs/promises";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "public/promo/promo.json");

export async function GET() {
  try {
    const configData = await fs.readFile(CONFIG_PATH, "utf-8");
    const config = JSON.parse(configData);

    const today = new Date();
    const nigeriaDate = new Date(today.getTime() + 1 * 60 * 60 * 1000);
    const nigeriaDay = nigeriaDate.getDay();

    console.log(today, nigeriaDate);

    if (config.isPromo) {
      await generatePromoCode();
      console.log("promo code was generated");
      return Response.json({ success: true, message: "Promo code generated" });
    }

    console.log("promocode was not generated");
    return Response.json({ success: false, message: "Promo is disabled" });

    // if (config.isPromo && nigeriaDay === 2) {
    //   await generatePromoCode();
    //   console.log("promo code was generated");
    //   return Response.json({ success: true, message: "Promo code generated" });
    // }

    // console.log("promocode was not generated");
    // return Response.json({ success: false, message: "Promo is disabled" });
  } catch (err) {
    console.log("Error generating promo code:", err);
  }
}
