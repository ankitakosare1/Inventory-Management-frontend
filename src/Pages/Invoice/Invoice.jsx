import React, { useState, useMemo, useEffect, useRef } from 'react'


import './InvoiceStyle.css'

import Sidebar from '../../Components/Sidebar/Sidebar'
import searchIcon from '../../assets/SearchIcon.png'
import trashIcon from '../../assets/TrashIcon.png'
import eyeIcon from '../../assets/EyeIcon.png'
import threeDots from '../../assets/ThreeDots.png'

import { useDispatch, useSelector } from 'react-redux'
import { setSearch, setInvoices, setInvoiceStats, setLoading, setError } from '../../redux/Slices/invoiceSlice'
import { fetchInvoices, fetchInvoiceStats, deleteInvoice, markInvoicePaid, incrementInvoiceProcessed } from '../../api/invoice'
import { formatDate } from '../../utils/date';
import InvoiceModal from '../../Components/Modals/InvoiceModal/InvoiceModal'

import MobileTopBar from '../../Components/MobileTopBar/MobileTopBar'
import MobileBottomNav from '../../Components/MobileBottomNav/MobileBottomView'

const Invoice = () => {
  const dispatch = useDispatch();
  const { items, page, totalPages, q, limit, stats, loading } = useSelector((s) => s.invoices);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [viewingId, setViewingId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null); // close menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (id) => {
    setMenuOpen(prev => prev === id ? null : id);
  };

  //Load overall stats
  const loadStats = async () => {
    try {
      const data = await fetchInvoiceStats();
      dispatch(setInvoiceStats(data));
    } catch (err) {
      dispatch(setError("Failed to load invoice stats"));
    }
  };

  //Load invoices
  const loadInvoices = async (params) => {
    dispatch(setLoading(true));
    try {
      const data = await fetchInvoices(params);
      dispatch(setInvoices(data));
    } catch (err) {
      dispatch(setError("Failed to load invoices"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadInvoices({ page, limit, q });
  }, [page, limit, q]);

  const handleDelete = async (invoiceId) => {
    try {
      await deleteInvoice(invoiceId);
      await loadInvoices({ page, limit, q });
      await loadStats(); // refresh stats after deletion
      setMenuOpen(null);
    } catch (err) {
      console.error("Error deleting invoice:", err);
    }
  };

  const handleMarkPaid = async (invoiceId) => {
    try {
      await markInvoicePaid(invoiceId);
      await loadInvoices({ page, limit, q });
      await loadStats();
      setMenuOpen(null);
    } catch (err) {
      console.log("Error marking invoice paid:", err);
    }
  };

  //Page controls
  const prevDisabled = useMemo(() => page <= 1, [page]);
  const nextDisabled = useMemo(() => page >= totalPages, [page, totalPages]);

  return (
    <div className='invoice-page'>
      <Sidebar />

      <div className="mobile-only">
        <MobileTopBar />
      </div>

      <div className='invoice-content'>
        {/* Header */}
        <div className='invoice-header'>
          <p className='invoice-heading'>Invoice</p>

          <div className='search-wrap'>
            <span className='search-icon'> <img src={searchIcon} alt='SearchIcon' /> </span>
            <input
              className='search-input'
              placeholder='Search here...'
              value={q}
              onChange={(e) => dispatch(setSearch(e.target.value))}
            />
          </div>
        </div>

        <div className='divider-from-sidebar' />

        {/* Overall Invoice Card */}
        <div className='overall-card-invoice'>
          <p className='card-heading-invoice'>Overall Invoice</p>
          <div className='card-row-invoice'>

            <div className='metric-invoice'>
              <div className='metric-title-invoice'>Recent Transactions</div>
              <div className='metric-value-invoice'>{stats?.recentTransactions ?? 0}</div>
              <div className='metric-sub-invoice'>Last 7 days</div>
            </div>

            <div className='v-sep' />

            <div className='metric-invoice'>
              <div className='metric-title-invoice'>Total Invoices</div>
              <div className='metric-flex-invoice'>
                <div>
                  <div className='metric-value-invoice'>
                    {stats?.totalInvoices ?? 0}
                  </div>
                  <div className='metric-sub-invoice'>
                    Last 7 days
                  </div>
                </div>

                <div>
                  <div className='metric-value-invoice'>
                    {stats?.processed ?? 0}
                  </div>
                  <div className='metric-sub-invoice'>
                    Processed
                  </div>
                </div>
              </div>
            </div>

            <div className='v-sep' />

            <div className='metric-invoice'>
              <div className='metric-title-invoice'>Paid Amount</div>
              <div className='metric-flex-invoice'>
                <div>
                  <div className='metric-value-invoice'>
                    ₹{(stats?.paidAmount ?? 0).toLocaleString()}
                  </div>
                  <div className='metric-sub-invoice'>
                    Last 7 days
                  </div>
                </div>

                <div>
                  <div className='metric-value-invoice'>
                    {stats?.customers ?? 0}
                  </div>
                  <div className='metric-sub-invoice'>
                    Customers
                  </div>
                </div>
              </div>
            </div>

            <div className='v-sep' />

            <div className='metric-invoice'>
              <div className='metric-title-invoice'>Unpaid Amount</div>
              <div className='metric-flex-invoice'>
                <div>
                  <div className='metric-value-invoice'>
                    ₹{(stats?.unpaidAmount ?? 0).toLocaleString()}
                  </div>
                  <div className='metric-sub-invoice'>
                    Ordered
                  </div>
                </div>

                <div>
                  <div className='metric-value-invoice'>
                    {stats?.pending ?? 0}
                  </div>
                  <div className='metric-sub-invoice'>
                    Pending Payment
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Invoice Table */}
        <div className='table-card-invoice desktop-only'>
          <div className='table-head-row-invoice'>
            <div className='table-title-invoice'>Invoices List</div>
          </div>

          <div className='table-scroll-invoice'>
            <table className='invoice-table'>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Reference Number</th>
                  <th>Amount (₹)</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>

              <tbody>
                {
                  items.map((inv) => (
                    <tr key={inv._id}>
                      <td>{inv.invoiceId}</td>
                      <td>{inv.referenceNumber}</td>
                      <td>{inv.amount}</td>
                      <td>{inv.status}</td>
                      <td className='menu-cell'>
                        {formatDate(inv.dueDate)}
                        <span>
                          <img src={threeDots}
                            alt='menu'
                            className='dots-icon'
                            onClick={() => toggleMenu(inv._id)}
                          />

                          {
                            menuOpen === inv._id && (
                              <div className='popup-menu' ref={menuRef}>
                                {inv.status === "Paid" ? (
                                  <>
                                    <div className='popup-item blue'
                                      onClick={async () => {
                                        try {
                                          await incrementInvoiceProcessed(inv._id);
                                          await loadStats();
                                          setViewingId(inv._id)
                                        } catch (err) {

                                        }
                                      }}
                                    >
                                      <img src={eyeIcon} alt='view' className='icon' />
                                      <span>View Invoice</span>
                                    </div>
                                    <div className='popup-item red' onClick={() => handleDelete(inv._id)}>
                                      <img src={trashIcon} alt='delete' className='icon' />
                                      <span>Delete</span>
                                    </div>
                                  </>
                                ) : (
                                  <div className='popup-item green' onClick={() => handleMarkPaid(inv._id)}>
                                    <img src={eyeIcon} alt='view' className='icon' />
                                    <span>Paid</span>
                                  </div>
                                )
                                }
                              </div>
                            )
                          }

                        </span>
                      </td>
                    </tr>
                  ))
                }
                {
                  !loading && items.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-cell">
                        No Invoices found
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className='pager-row'>
            <button
              className='pager-btn'
              disabled={prevDisabled}
              onClick={() => loadInvoices({ page: page - 1, limit, q })}
            >
              Previous
            </button>

            <div className='pager-info'>
              Page {page} of {totalPages}
            </div>

            <button
              className='pager-btn'
              disabled={nextDisabled}
              onClick={() => loadInvoices({ page: page + 1, limit, q })}
            >
              Next
            </button>
          </div>

        </div>

        {/* ----------- Mobile Only ---------- */}
        <div className='table-card-invoice mobile-only'>
          <div className='table-head-row-invoice'>
            <div className='table-title-invoice'>Invoices List</div>
          </div>

          <div className='table-scroll-invoice'>
            <table className='invoice-table mobile-invoice-table'>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((inv) => (
                  <tr key={inv._id}>
                    <td>{inv.invoiceId}</td>
                    <td className='action-cell'>
                      {inv.status === "Paid" ? (
                        <>
                          <img
                            src={eyeIcon}
                            alt="view"
                            className="mobile-icon"
                            onClick={() => setViewingId(inv._id)}
                          />
                          <img
                            src={trashIcon}
                            alt="delete"
                            className="mobile-icon"
                            onClick={() => handleDelete(inv._id)}
                          />
                        </>
                      ) : (
                        <img
                          src={eyeIcon}
                          alt="paid"
                          className="mobile-icon"
                          onClick={() => handleMarkPaid(inv._id)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='pager-row'>
            <button
              className='pager-btn'
              disabled={prevDisabled}
              onClick={() => loadInvoices({ page: page - 1, limit, q })}
            >
              Previous
            </button>

            <div className='pager-info'>
              Page {page} of {totalPages}
            </div>

            <button
              className='pager-btn'
              disabled={nextDisabled}
              onClick={() => loadInvoices({ page: page + 1, limit, q })}
            >
              Next
            </button>
          </div>
        </div>

        {viewingId && (
          <InvoiceModal
            invoiceId={viewingId}
            onClose={() => setViewingId(null)}
          />
        )}

      </div>

      {/* Mobile BottomNav */}
      <div className="mobile-only">
        <MobileBottomNav />
      </div>

    </div>
  )
}

export default Invoice
