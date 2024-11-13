import toast from 'react-hot-toast';
import ReactDOMServer from 'react-dom/server';

const handleCopyText = (text: string) => {
    const textToCopy = ReactDOMServer.renderToStaticMarkup(<>{text}</>);

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

    } catch (err) {
        console.error('Copy failed: ', err);
    }

    // Xóa phần tử div ẩn
    document.body.removeChild(hiddenDiv);
};

export { handleCopyText };