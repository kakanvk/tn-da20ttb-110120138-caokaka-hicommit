import React, { useState, useRef, useEffect } from "react";
import { Badge } from "./badge";
import { Clipboard, Code, Copy, Image, Pi, Scissors } from "lucide-react";
import { useTheme } from "../theme-provider";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "./button";
import { InlineMath } from "react-katex";
import { renderToString } from "react-dom/server";

import "//unpkg.com/mathlive";

interface TextAndMathEditorProps {
    placeholder?: string;
    className?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
}

const TextAndMathEditor: React.FC<TextAndMathEditorProps> = ({ className, placeholder, defaultValue = "", onChange }) => {

    const { theme } = useTheme();
    const mf = useRef(null);
    const editorRef = useRef(null);
    const [value, setValue] = useState("");
    const [prevRange, setPrevRange] = useState(null);

    const [showPlaceholder, setShowPlaceholder] = useState(true);

    const autoToggleKeyBoard = () => {
        (window as any).mathVirtualKeyboard.show();
    }

    const handlePlaceholder = () => {
        const editor = editorRef.current as any;
        if (onChange) {
            onChange(editor.innerHTML.toString());
        }
        if (editor) {
            // Check if the editor is empty and <div>
            if (editor.textContent === "") {
                setShowPlaceholder(true);
            } else {
                setShowPlaceholder(false);
            }
        }
    };

    const handleKeyDown = (e: any) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (editorRef.current) {
                const editor = editorRef.current;
                const selection = window.getSelection();
                if (selection) {
                    const range = selection.getRangeAt(0);
                    const br = document.createElement("br");
                    range.insertNode(br);
                    range.setStartAfter(br);
                    range.setEndAfter(br);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }
    };

    useEffect(() => {
        if (defaultValue) {
            setShowPlaceholder(false);
        }
        const editor = editorRef.current as any;
        if (editor) {
            editor.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            if (editor) {
                editor.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, []);

    const handleStoreRange = () => {
        const selection = window.getSelection();
        if (selection) {
            const range = selection.getRangeAt(0) as any;
            setPrevRange(range.cloneRange());
        }
    };

    const handleInsertMath = (math: any) => {
        if (value) {
            const mathJSX = (
                <>
                    <p className="inline"/>
                    <div contentEditable={false} className="w-fit math-badge inline-block" data-math="123">
                        <Badge className="rounded-sm px-0.5 py-0 bg-transparent cursor-pointer m-0" variant="secondary">
                            <InlineMath math={math} />
                        </Badge>
                    </div>
                    <p className="inline"/>
                </>
            );
            const mathHTMLString = renderToString(mathJSX);
            if (editorRef.current && prevRange) {
                const editor = editorRef.current;
                const range = prevRange as any;
                const frag = range.createContextualFragment(mathHTMLString);
                range.deleteContents();
                range.insertNode(frag);
                // Restore selection
                range.collapse(false);
                const selection = window.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
                setValue("");
                setShowPlaceholder(false);
                if (onChange) {
                    onChange((editor as any)?.innerHTML.toString());
                }
            }
        }
    };

    return (
        <div className="flex flex-col gap-2 items-start">
            <AlertDialog>
                <ContextMenu>
                    <ContextMenuTrigger asChild>
                        <div className="relative w-full">
                            <p
                                ref={editorRef}
                                onInput={() => {
                                    handlePlaceholder();
                                }}
                                onChange={() => {
                                    handlePlaceholder();
                                }}
                                contentEditable
                                spellCheck="false"
                                suppressContentEditableWarning={true}
                                className="w-full leading-6 min-h-[90px] whitespace-pre-line max-h-[300px] overflow-auto rounded-md border border-input bg-secondary/5 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 placeholder:italic"
                                dangerouslySetInnerHTML={{ __html: defaultValue }}
                            >
                            </p>
                            {
                                showPlaceholder &&
                                <span className="absolute top-2.5 text-sm italic dark:font-light left-3 opacity-65 pointer-events-none">
                                    {placeholder}
                                </span>
                            }
                        </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuItem><Scissors className="w-4 h-4 mr-3" />Cắt</ContextMenuItem>
                        <ContextMenuItem><Copy className="w-4 h-4 mr-3" />Sao chép</ContextMenuItem>
                        <ContextMenuItem><Clipboard className="w-4 h-4 mr-3" />Dán</ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem><Image className="w-4 h-4 mr-3" />Chèn hình ảnh</ContextMenuItem>
                        <ContextMenuItem><Code className="w-4 h-4 mr-3" />Chèn khối code</ContextMenuItem>
                        <AlertDialogTrigger>
                            <ContextMenuItem className="pr-4" onClick={handleStoreRange}><Pi className="w-4 h-4 mr-3" />Chèn biểu thức toán học</ContextMenuItem>
                        </AlertDialogTrigger>
                    </ContextMenuContent>
                </ContextMenu>
                <AlertDialogContent className="top-[30%]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Chèn biểu thức toán học</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div>
                        <math-field
                            ref={mf}
                            onInput={(evt: any) => setValue(evt.target.value)}
                            onFocus={() => autoToggleKeyBoard()}
                            style={{
                                width: "100%",
                                paddingLeft: "10px",
                                border: theme == "dark" ? "1px solid #bebebe55" : "1px solid #bebebe",
                                borderRadius: "5px",
                                backgroundColor: "transparent",
                                color: theme === "dark" ? "#fff" : "#000"
                            }}
                        >
                            {value}
                        </math-field>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button variant="ghost">
                                Huỷ
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleInsertMath(value)}>Chèn</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default TextAndMathEditor;
