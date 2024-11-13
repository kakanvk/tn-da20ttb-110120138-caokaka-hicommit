import { cn } from '@/lib/utils';
import React from 'react';
import { Badge } from './badge';
import ReactDOMServer from 'react-dom/server';

import { Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface CodeAreaProps {
    className?: string;
    children?: React.ReactNode;
    ref?: React.RefObject<HTMLDivElement>;
}

const CodeArea: React.FC<CodeAreaProps> = ({ children, className, ref }) => {

    const [isCopied, setIsCopied] = React.useState(false);

    const handleCopyText = () => {
        const textToCopy = ReactDOMServer.renderToStaticMarkup(<>{children}</>);

        // Tạo một phần tử div ẩn để chứa nội dung cần copy
        const hiddenDiv = document.createElement('div');
        hiddenDiv.innerHTML = textToCopy;

        hiddenDiv.style.position = 'absolute';
        hiddenDiv.style.left = '-9999px';
        hiddenDiv.style.whiteSpace = 'pre-wrap';

        document.body.appendChild(hiddenDiv);

        // Lựa chọn nội dung trong div ẩn
        const range = document.createRange();
        range.selectNode(hiddenDiv);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);

        // Copy nội dung đã chọn vào clipboard
        try {
            document.execCommand('copy');
            toast.success('Đã copy vào bộ nhớ tạm', {
                style: {
                    borderRadius: '8px',
                    background: '#222',
                    color: '#fff',
                    paddingLeft: '15px',
                    fontFamily: 'Plus Jakarta Sans',
                }
            });

            setIsCopied(true);

            // Ẩn nút check sau 3 giây
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);

        } catch (err) {
            console.error('Copy failed: ', err);
        }

        // Xóa phần tử div ẩn
        document.body.removeChild(hiddenDiv);
    };

    return (
        <div
            className={cn(
                `relative overflow-hidden bg-zinc-100/80 dark:bg-zinc-900 border rounded-lg 
                font-mono text-[12px] p-3.5 py-2 min-h-10 whitespace-pre-wrap leading-6 group/code-area duration-200`,
                className
            )}
            ref={ref}
        >
            <p className='font-semibold opacity-85 dark:font-normal'>
                {children}
            </p>
            <Badge
                className='invisible opacity-0 group-hover/code-area:visible group-hover/code-area:opacity-100 duration-200 absolute top-1 right-1 font-medium rounded hover:bg-secondary cursor-pointer py-[3px] scale-90'
                variant="outline"
                onClick={() => handleCopyText()}
            >
                {
                    isCopied ?
                        <Check className='w-[15px] translate-x-[0.5px]' /> :
                        <Copy className='w-[15px] translate-x-[0.5px]' />
                }
            </Badge>
        </div>
    );
}

export default CodeArea;
