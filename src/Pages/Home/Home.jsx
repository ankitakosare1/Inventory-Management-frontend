import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import SalesPurchaseChart from "../../Components/SalesPurchaseChart/SalesPurchaseChart";
import TopProducts from "../../Components/TopProducts/TopProducts";
import { fetchDashboardHome } from "../../api/dashboard";
import "./HomeStyle.css";

import sales from '../../assets/Sales.png'
import revenue from '../../assets/Revenue.png'
import profit from '../../assets/Profit.png'
import salesOverviewCost from '../../assets/SalesOverviewCost.png'
import purchase from '../../assets/Purchase.png'
import purchaseOverviewCost from '../../assets/PurchaseOverviewCost.png'
import cancel from '../../assets/Cancel.png'
import returnIcon from '../../assets/Return.png'
import quantityInHand from '../../assets/QuantityInHand.png'
import toBeReceived from '../../assets/ToBeReceived.png'
import noOfSuppliers from '../../assets/NumberOfSuppliers.png'
import noOfCategories from '../../assets/NumberOfCategories.png'

import MobileTopBar from "../../Components/MobileTopBar/MobileTopBar";
import MobileBottomNav from "../../Components/MobileBottomNav/MobileBottomView";

const Home = () => {
  const [data, setData] = useState(null);

  // Group A: Sales + Purchase + Sales & Purchase
  const [groupA, setGroupA] = useState(["sales", "purchase", "salesPurchase"]);
  const [draggedA, setDraggedA] = useState(null);

  // Group B: Inventory + Product + Top Products
  const [groupB, setGroupB] = useState(["inventory", "product", "topProducts"]);
  const [draggedB, setDraggedB] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const homeData = await fetchDashboardHome();
        setData(homeData);
      } catch (err) {
        console.error("Failed to fetch home data:", err);
      }
    };
    getData();
  }, []);

  if (!data) return <div>Loading...</div>;

  // Reorder helper
  const handleDrop = (list, setList, dragged, setDragged, dropIndex) => {
    if (dragged === null) return;
    const updated = [...list];
    const [moved] = updated.splice(dragged, 1);
    updated.splice(dropIndex, 0, moved);
    setList(updated);
    setDragged(null);
  };

  return (
    <div className="home-container">
      <Sidebar />

      <div className="home-content">
        {/* Mobile Topbar  */}
        <MobileTopBar />

        <div className="desktop-layout">
          <div className='product-header'>
            <p className='product-heading'>Home</p>
          </div>

          <div className='divider-from-sidebar' />

          <div className="dashboard-rows">

            {/* Group A (Sales / Purchase / Sales & Purchase) */}
            <div className="groupA">
              {groupA.map((item, index) => (
                <div
                  key={item}
                  draggable
                  onDragStart={() => setDraggedA(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(groupA, setGroupA, draggedA, setDraggedA, index)}
                  className="card card1"
                >
                  {item === "sales" && (
                    <>
                      <h3>Sales Overview</h3>
                      <div className="sales-metrics">
                        <div className="metrics">
                          <img src={sales} alt='Sales' />
                          <div className="value-label">
                            <span className="value">₹{data.salesOverview.sales}</span>
                            <span className="label">Sales</span>
                          </div>
                        </div>
                        <div className="metrics">
                          <img src={revenue} alt='Revenue' />
                          <div className="value-label">
                            <span className="value">₹{data.salesOverview.revenue}</span>
                            <span className="label">Revenue</span>
                          </div>
                        </div>
                        <div className="metrics">
                          <img src={profit} alt='Profit' />
                          <div className="value-label">
                            <span className="value">₹{data.salesOverview.profit}</span>
                            <span className="label">Profit</span>
                          </div>
                        </div>
                        <div className="metrics">
                          <img src={salesOverviewCost} alt='Cost' />
                          <div className="value-label">
                            <span className="value">₹{data.salesOverview.cost}</span>
                            <span className="label">Cost</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {item === "purchase" && (
                    <>
                      <h3>Purchase Overview</h3>
                      <div className="sales-metrics">
                        <div className="metrics">
                          <img src={purchase} alt='Purchase' />
                          <div className="value-label">
                            <span className="value">₹{data.purchaseOverview.purchase}</span>
                            <span className="label">Purchase</span>
                          </div>
                        </div>
                        <div className="metrics">
                          <img src={purchaseOverviewCost} alt='Cost' />
                          <div className="value-label">
                            <span className="value">₹{data.purchaseOverview.cost}</span>
                            <span className="label">Cost</span>
                          </div>
                        </div>
                        <div className="metrics">
                          <img src={cancel} alt='Cancel' />
                          <div className="value-label">
                            <span className="value">₹{data.purchaseOverview.cancel}</span>
                            <span className="label">Cancel</span>
                          </div>
                        </div>
                        <div className="metrics">
                          <img src={returnIcon} alt='Return' />
                          <div className="value-label">
                            <span className="value">₹{data.purchaseOverview.return}</span>
                            <span className="label">Return</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {item === "salesPurchase" && (
                    <SalesPurchaseChart />

                  )}
                </div>
              ))}
            </div>


            {/* Group B (Inventory / Product / Top Products) */}
            <div className="groupB">
              {groupB.map((item, index) => (
                <div
                  key={item}
                  draggable
                  onDragStart={() => setDraggedB(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(groupB, setGroupB, draggedB, setDraggedB, index)}
                  className="card card2"
                >
                  {item === "inventory" && (
                    <>
                      <h3>Inventory Summary</h3>
                      <div className="sales-metrics">
                        <div className="metrics">
                          <img src={quantityInHand} alt='Quantity in Hand' />
                          <span className="value"> {data.inventorySummary.qtyInHand} </span>
                          <span className="label">Quantity in Hand</span>
                        </div>
                        <div className="metrics">
                          <img src={toBeReceived} alt='To be Received' />
                          <span className="value"> {data.inventorySummary.toBeReceived} </span>
                          <span className="label">To be Received</span>
                        </div>
                      </div>
                    </>
                  )}

                  {item === "product" && (
                    <>
                      <h3>Product Summary</h3>
                      <div className="sales-metrics">
                        <div className="metrics">
                          <img src={noOfSuppliers} alt='No of Suppliers' />
                          <span className="value"> {data.productSummary.suppliers} </span>
                          <span className="label">Number of Suppliers</span>
                        </div>
                        <div className="metrics">
                          <img src={noOfCategories} alt='Number of Categories' />
                          <span className="value"> {data.productSummary.categories} </span>
                          <span className="label">Number of Categories</span>
                        </div>
                      </div>
                    </>


                  )}

                  {item === "topProducts" && (
                    <TopProducts />

                  )}
                </div>
              ))}
            </div>


          </div>
        </div>

        <div className="mobile-layout">
          {/* 1. Sales & Purchase chart */}
          <SalesPurchaseChart />

          {/* 2. Sales Overview card */}
          <div className="card">
            <h3>Sales Overview</h3>
            <div className="sales-metrics">
              <div className="metrics">
                <img src={sales} alt="Sales" />
                <div className="value-label">
                  <span className="value">₹{data.salesOverview.sales}</span>
                  <span className="label">Sales</span>
                </div>
              </div>
              <div className="metrics">
                <img src={revenue} alt="Revenue" />
                <div className="value-label">
                  <span className="value">₹{data.salesOverview.revenue}</span>
                  <span className="label">Revenue</span>
                </div>
              </div>
              <div className="metrics">
                <img src={profit} alt="Profit" />
                <div className="value-label">
                  <span className="value">₹{data.salesOverview.profit}</span>
                  <span className="label">Profit</span>
                </div>
              </div>
              <div className="metrics">
                <img src={salesOverviewCost} alt="Cost" />
                <div className="value-label">
                  <span className="value">₹{data.salesOverview.cost}</span>
                  <span className="label">Cost</span>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
      <MobileBottomNav />
    </div>
  );
};

export default Home;


