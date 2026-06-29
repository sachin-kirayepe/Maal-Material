import React, { useEffect, useState } from "react";
import { Card, Button } from "@constructos/ui";
import { useWhatsAppStore } from "../../stores/whatsappStore";
import { useTenantId } from "@/hooks/useTenantId";
import {
  MessageCircle as MessageCircleIcon,
  FileText as FileTextIcon,
  Send as SendIcon,
} from "lucide-react";
const MessageCircle = MessageCircleIcon as any;
const FileText = FileTextIcon as any;
const Send = SendIcon as any;

export default function WhatsappOperations() {
  const { workflows, isLoading, fetchWorkflows, initiateWorkflow } = useWhatsAppStore();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const tenantId = useTenantId();

  useEffect(() => {
    fetchWorkflows(tenantId);
  }, [fetchWorkflows]);

  const handleSendQuote = async () => {
    if (phone.length < 10 || !amount) return;

    await initiateWorkflow(tenantId, {
      shopId: "",
      phoneNumber: phone,
      workflowType: "QUOTATION",
      referenceId: `quote-${Date.now()}`,
      contextData: { amount: Number(amount) },
    });

    setPhone("");
    setAmount("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="text-green-500" />
            WhatsApp Commerce
          </h1>
          <p className="text-gray-500">Conversational orders and quotations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText size={20} />
            Quick Quotation
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer WhatsApp Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quotation Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSendQuote}
              disabled={isLoading || !amount || phone.length < 10}
            >
              <Send size={16} className="mr-2" />
              Send via WhatsApp
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Recent Workflows</h2>
          {isLoading && workflows.length === 0 ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : workflows.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent conversations.</p>
          ) : (
            <div className="space-y-3">
              {workflows.map((wf) => (
                <div
                  key={wf.id}
                  className="p-3 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-sm">{wf.phoneNumber}</p>
                    <p className="text-xs text-gray-500">
                      {wf.workflowType} • {wf.referenceId}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      wf.state === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : wf.state === "FAILED"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {wf.state}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
