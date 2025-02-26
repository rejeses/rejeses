import { getTransactionByReference } from "@/app/services/repository/transactions/transactions";
import { getOrderById } from "@/app/services/repository/order/order";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const reference = searchParams.get("reference");

    if (!reference)
      return Response.json({ message: "Invalid query" }, { status: 400 });

    if (typeof reference !== "string")
      return Response.json({ message: "Invalid reference" }, { status: 400 });

    const data = await getTransactionByReference(reference);

    if (!data)
      return Response.json(
        { message: "Transaction not found" },
        { status: 404 }
      );

    const order = await getOrderById(Number(data.orderRef));

    if (!order)
      return Response.json(
        { message: "Order for this transaction not found" },
        { status: 404 }
      );

    return Response.json({ data, order, message: "Successful", status: 200 });
  } catch (err) {
    console.log("Error getting transaction status", err);
    return Response.json(
      { message: "Failed to get transaction status" },
      { status: 500 }
    );
  }
}
