import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { geminiChat } from "@/service/API/Gemini";
import Loader2 from "@/components/ui/loader2";

function GeminiChat() {

    const [message, setMessage] = useState("");
    const [response, setResponse] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        setIsLoading(true);
        const response = await geminiChat(message);
        // Convert response to JSON
        console.log(response.response);
        setResponse(response.response);
        setIsLoading(false);
    }

    return (
        <div className="GeminiChat p-6 px-8 flex gap-4">
            <div className="flex flex-col gap-4 items-start flex-1 relative h-[500px]">
                <Textarea
                    placeholder="Nhập câu hỏi của bạn"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="h-full rounded-xl p-3 px-4 bg-secondary/40 text-base"
                    style={{ fieldSizing: "content" }}
                    spellCheck={false}
                />
                <Button className="rounded-lg mt-0.5 ml-auto absolute bottom-3 right-3" onClick={handleSendMessage} disabled={!message}>Gửi câu hỏi</Button>
            </div>
            <div className="flex flex-col gap-3 p-4 py-3 bg-secondary/40 border rounded-xl flex-1 h-[500px] overflow-y-auto">
                {
                    isLoading ? (
                        <div className="flex items-center justify-center h-full w-full">
                            <Loader2 />
                        </div>
                    ) : (
                        <p className="break-words whitespace-pre-line">{response}</p>
                    )
                }
            </div>
        </div>
    );
};

export default GeminiChat;