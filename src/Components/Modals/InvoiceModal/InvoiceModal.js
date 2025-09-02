import React, { useEffect, useMemo, useRef, useState } from 'react'
import { fetchInvoiceById } from '../../../api/invoice'

import closeIcon from '../../../assets/CloseIcon.png'
import downloadIcon from '../../../assets/DownloadIcon.png'
import printIcon from '../../../assets/PrintIcon.png'
import quoteIcon from '../../../assets/QuoteIcon.png'
import { formatDate } from '../../../utils/date'
import html2pdf from 'html2pdf.js'

import './InvoiceModalStyle.css'

const InvoiceModal = ({ invoiceId, onClose }) => {
  const overlayRef = useRef(null);
  const paperRef = useRef(null);
  const [data, setData] = useState(null);


  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  useEffect(() => {
    (async () => {
      const d = await fetchInvoiceById(invoiceId);
      setData(d);
    })();
  }, [invoiceId]);

  // Close when clicking outside the card
  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  const sub = data?.totals?.subtotal ?? 0;
  const tax = data?.totals?.tax ?? 0;
  const total = data?.totals?.totalDue ?? 0;

  const onPrint = () => {
    if (!paperRef.current) return;

    const printContent = paperRef.current.innerHTML;

    const win = window.open("", "_blank", "width=800,height=900");

    // Clone all style and link tags from current document head
    const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
      .map(node => node.outerHTML)
      .join("\n");

    win.document.write(`
    <html>
      <head>
        <title>${data?.invoiceId || "Invoice"}</title>
        ${styles}
      </head>
      <body>
        <div class="iv-paper">
          ${printContent}
        </div>
      </body>
    </html>
  `);

    win.document.close();

    // Wait until the styles are applied before printing
    win.onload = () => {
      win.focus();
      win.print();
      win.close();
    };
  };


  const onDownload = async () => {
    if (!paperRef.current) return;
    const element = paperRef.current;

    const opt = {
      margin: 0.5,
      filename: `${data?.invoiceId || "invoice"}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    await html2pdf().from(element).set(opt).save();
  };

  if (!data) return null;

  return (
    <div className='iv-overlay' ref={overlayRef} onMouseDown={onOverlayClick}>
      <div className='iv-floater'>
        <button className='iv-fab iv-red' onClick={onClose}>
          <img src={closeIcon} alt='CloseIcon' />
        </button>

        <button className='iv-fab iv-blue' onClick={onDownload}>
          <img src={downloadIcon} alt='DownloadIcon' />
        </button>

        <button className='iv-fab iv-amber' onClick={onPrint}>
          <img src={printIcon} alt='PrintIcon' />
        </button>
      </div>

      <div className='iv-paper' ref={paperRef} onMouseDown={(e) => e.stopPropagation()}>
        <div className='iv-title'>INVOICE</div>

        {/* Billed to block */}
        <div className='iv-billed-layout'>
          <div className='iv-bold'>Billed to</div>
          <div className='iv-billed'>
            <div className='iv-billed-left'>
              <div className='iv-dim'>Company Name</div>
              <div className='iv-dim'>Company Address</div>
              <div className='iv-dim'>City, Country - 00000</div>
            </div>

            <div className='iv-billed-right'>
              <div className='iv-right-line'>InventryPro</div>
              <div className='iv-right-line'>Pune, Maharashtra, IN - 411001</div>
              <div className='iv-right-line'>TAX ID 00XXXXX1234X0XX</div>
            </div>
          </div>



        </div>

        {/* Left data + Right Table */}
        <div className='iv-main'>
          <div className='iv-meta'>
            <div className='iv-meta-block'>
              <div className='iv-label'>Invoice #</div>
              <div className='iv-value'>{data.invoiceId?.replace(/-/g, "_")}</div>
            </div>

            <div className='iv-meta-block'>
              <div className='iv-label'>Invoice date</div>
              <div className='iv-value'>
                {formatDate(data.createdAt)}
              </div>
            </div>

            <div className='iv-meta-block'>
              <div className='iv-label'>Reference</div>
              <div className='iv-value'>{data.referenceNumber || "-"}</div>
            </div>

            <div className='iv-meta-block'>
              <div className='iv-label'>Due date</div>
              <div className='iv-value'>
                {formatDate(data.dueDate)}
              </div>
            </div>

          </div>

          <div className='iv-table-wrap'>
            <table className='iv-table'>
              <thead>
                <tr>
                  <th>Products</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.rows.map((r, i) => (
                    <tr key={i}>
                      <td>{r.name}</td>
                      <td>{r.qty}</td>
                      <td>₹{r.price}</td>
                    </tr>
                  ))
                }
                {/* <tr className='iv-row-sep'>
                  <td colSpan="3"></td>
                </tr> */}

                <tr>
                  <td className='iv-subcell'>Subtotal</td>
                  <td></td>
                  <td className='iv-right'>₹{sub}</td>
                </tr>

                <tr>
                  <td className='iv-subcell'>Tax (10%)</td>
                  <td></td>
                  <td className='iv-right'>₹{tax}</td>
                </tr>

                <tr className='iv-total-row'>
                  <td className='iv-total-text'>Total due</td>
                  <td></td>
                  <td className='iv-total-amt'>₹{total}</td>
                </tr>

              </tbody>
            </table>

          </div>
        </div>

        {/* Foot note */}
        <div className='iv-note'>
          <span className='iv-quote'> <img src={quoteIcon} alt='QuoteIcon' /> </span>
          <span>Please pay within 10 days of receiving this invoice.</span>
        </div>

        {/* Footer strip */}
        <div className='iv-footer'>
          <span>www.inventrypro.inc</span>
          <span>+91 00000 00000</span>
          <span>inventrypro@gmail.com</span>
        </div>

      </div>


    </div>
  )
}

export default InvoiceModal
