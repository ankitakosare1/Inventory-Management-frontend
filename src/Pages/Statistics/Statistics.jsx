import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import SalesPurchaseChart from "../../Components/SalesPurchaseChart/SalesPurchaseChart";
import TopProducts from "../../Components/TopProducts/TopProducts";
import { fetchDashboardStatistics } from "../../api/dashboard";
import "./StatisticsStyle.css";

import MobileBottomNav from "../../Components/MobileBottomNav/MobileBottomView";
import MobileTopBar from "../../Components/MobileTopBar/MobileTopBar";

const Statistics = () => {
  const [stats, setStats] = useState(null);

  // Group A: stat cards row
  const [groupA, setGroupA] = useState(["revenue", "sold", "stock"]);
  const [draggedA, setDraggedA] = useState(null);

  // Group B: chart + top products row
  const [groupB, setGroupB] = useState(["salesPurchase", "topProducts"]);
  const [draggedB, setDraggedB] = useState(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchDashboardStatistics();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch statistics:", err);
      }
    };
    getStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

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
    <div className="statistics-container">
      <div className="desktop-layout-statistics">
        <Sidebar />
        <div className="statistics-content">


          <div className="product-header">
            <p className="product-heading">Statistics</p>
          </div>

          <div className="divider-from-sidebar" />



          {/* Group A (Stat cards row) */}
          <div className="stats-row">
            {groupA.map((item, index) => (
              <div
                key={item}
                draggable
                onDragStart={() => setDraggedA(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() =>
                  handleDrop(groupA, setGroupA, draggedA, setDraggedA, index)
                }
                className={`stat-card ${item === "revenue"
                  ? "yellow"
                  : item === "sold"
                    ? "green"
                    : "lavender"
                  }`}
              >
                {item === "revenue" && (
                  <>
                    <h3>Total Revenue</h3>
                    <p>₹{stats.totalRevenue.value}</p>
                    <span>{stats.totalRevenue.change} from last month</span>
                  </>
                )}

                {item === "sold" && (
                  <>
                    <h3>Products Sold</h3>
                    <p>{stats.productsSold.value}</p>
                    <span>{stats.productsSold.change} from last month</span>
                  </>
                )}

                {item === "stock" && (
                  <>
                    <h3>Products in Stock</h3>
                    <p>{stats.productsInStock.value}</p>
                    <span>{stats.productsInStock.change} from last month</span>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Group B (Sales & Purchase + Top Products row) */}
          <div className="card-rows">
            {groupB.map((item, index) => (
              <div
                key={item}
                draggable
                onDragStart={() => setDraggedB(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() =>
                  handleDrop(groupB, setGroupB, draggedB, setDraggedB, index)
                }
                className={`card ${item === "salesPurchase" ? "card1" : "card2"}`}
              >
                {item === "salesPurchase" && <SalesPurchaseChart />}
                {item === "topProducts" && <TopProducts />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="mobile-layout-statistics">
        <MobileTopBar />

        <div className="statistics-content">
          <div className="chart-section">
            <SalesPurchaseChart />
          </div>

          <div className="stats-row mobile-stats">
            <div className="stat-card yellow">
              <h3>Total Revenue</h3>
              <p>₹{stats.totalRevenue.value}</p>
              <span>{stats.totalRevenue.change} from last month</span>
            </div>
            <div className="stat-card green">
              <h3>Products Sold</h3>
              <p>{stats.productsSold.value}</p>
              <span>{stats.productsSold.change} from last month</span>
            </div>
            <div className="stat-card lavender">
              <h3>Products in Stock</h3>
              <p>{stats.productsInStock.value}</p>
              <span>{stats.productsInStock.change} from last month</span>
            </div>
          </div>
        </div>

        <MobileBottomNav />
      </div>


    </div>
  );
};

export default Statistics;




