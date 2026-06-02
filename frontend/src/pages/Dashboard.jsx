import { Boxes, ChartNoAxesColumnIncreasing, IndianRupee, PackageOpen, ShoppingCart, UsersRound } from 'lucide-react';
import Chart from 'react-apexcharts';

import { EmptyState } from '../components/EmptyState.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Stat } from '../components/Stat.jsx';
import { money } from '../lib/formatters.js';

const chartColors = ['#5b7cfa', '#e86be8', '#8a55c4'];

export function Dashboard({ stats }) {
  const hasProducts = stats.products > 0;
  const hasOrders = stats.orders > 0;
  const stockSeries = stats.stockBuckets.map((item) => item.value);
  const stockLabels = stats.stockBuckets.map((item) => item.label);
  const revenueLabels = stats.revenueByMonth.map((item) => item.label);
  const revenueSeries = stats.revenueByMonth.map((item) => item.value);
  const chartTextColor = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#667085';
  const chartLineColor = getComputedStyle(document.documentElement).getPropertyValue('--line').trim() || '#e0e5ec';
  const stockOptions = {
    chart: { animations: { enabled: true }, toolbar: { show: false } },
    colors: chartColors,
    dataLabels: { enabled: false },
    labels: stockLabels,
    legend: {
      fontWeight: 700,
      labels: { colors: chartTextColor },
      markers: { size: 5 },
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '58%',
          labels: {
            show: true,
            total: { show: true, label: 'Units', formatter: () => String(stats.stock) },
            value: { formatter: (value) => value },
          },
        },
      },
    },
    stroke: { width: 0 },
  };
  const revenueOptions = {
    chart: { animations: { enabled: true }, toolbar: { show: false } },
    colors: ['#5b7cfa'],
    dataLabels: { enabled: false },
    grid: { borderColor: chartLineColor },
    plotOptions: { bar: { borderRadius: 5, columnWidth: revenueLabels.length <= 1 ? '14%' : '32%' } },
    tooltip: { y: { formatter: (value) => money.format(value) } },
    xaxis: {
      categories: revenueLabels,
      axisBorder: { color: chartLineColor },
      axisTicks: { color: chartLineColor },
      labels: { style: { colors: chartTextColor, fontWeight: 700 } },
    },
    yaxis: {
      labels: {
        formatter: (value) => money.format(value),
        style: { colors: chartTextColor, fontWeight: 700 },
      },
    },
  };

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of inventory and orders for your Inventory Management workspace" />
      <section className="stats compact-stats" aria-label="Inventory summary">
        <Stat icon={Boxes} label="Products" value={stats.products} tone="green" />
        <Stat icon={UsersRound} label="Customers" value={stats.customers} tone="blue" />
        <Stat icon={ShoppingCart} label="Orders" value={stats.orders} tone="amber" />
        <Stat icon={IndianRupee} label="Revenue" value={money.format(stats.revenue)} tone="violet" />
      </section>
      <section className="dashboard-grid chart-dashboard">
        <article className="panel insight-panel chart-panel">
          <div className="panel-title">
            <span className="title-icon teal"><Boxes size={19} aria-hidden="true" /></span>
            <div>
              <h2>Stock health</h2>
              <p>Live product availability</p>
            </div>
          </div>
          {!hasProducts && <EmptyState title="No products yet" description="Add products to see stock distribution." />}
          {hasProducts && (
            <Chart options={stockOptions} series={stockSeries} type="donut" height={282} />
          )}
        </article>
        <article className="panel insight-panel chart-panel">
          <div className="panel-title">
            <span className="title-icon purple"><ChartNoAxesColumnIncreasing size={19} aria-hidden="true" /></span>
            <div>
              <h2>Orders and sales</h2>
              <p>Total revenue by month</p>
            </div>
          </div>
          {!hasOrders && <EmptyState title="No orders yet" description="Create your first order to see the breakdown." />}
          {hasOrders && (
            <Chart options={revenueOptions} series={[{ name: 'Revenue', data: revenueSeries }]} type="bar" height={282} />
          )}
        </article>
      </section>
      <section className="panel stocked-panel">
        <div className="panel-title">
          <span className="title-icon orange"><PackageOpen size={19} aria-hidden="true" /></span>
          <div>
            <h2>Top stocked products</h2>
            <p>Highest inventory levels</p>
          </div>
        </div>
        {stats.topStockedProducts.length === 0 && <EmptyState icon={PackageOpen} title="No products yet" description="Inventory rankings will appear when products are added." />}
        {stats.topStockedProducts.length > 0 && (
          <div className="activity-list product-rank-list">
            {stats.topStockedProducts.map((product) => (
              <div className="activity-row" key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.sku}</span>
                </div>
                <b>{product.stock} units</b>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
