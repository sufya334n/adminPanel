import { useEffect, useState } from 'react';
import { getAnalyticsData } from '../api';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import '../styles/analytics.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const FILTERS = [
  { label: 'All Time', value: 'all' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Daily', value: 'daily' }
];

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState('all');

  const fetchData = async (range) => {
    setLoading(true);
    try {
      const data = await getAnalyticsData(range);
      if (data) setAnalytics(data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedRange);
  }, [selectedRange]);

  if (loading) return <p>Loading analytics...</p>;
  if (!analytics) return <p>Failed to load analytics.</p>;

  const { users, payouts } = analytics;

  // Chart data: Users
  const userChartData = {
    labels: ['Active Users', 'Total Users'],
    datasets: [
      {
        label: 'Users',
        data: [users.activeUsers, users.totalUsers],
        backgroundColor: ['#4ade80', '#f87171'],
      }
    ]
  };

  // Chart data: Sales & Profit
  const totalSales = analytics.sales.totalSales/100;
  const platformProfit = totalSales - analytics.payouts.totalPaidPayouts - analytics.payouts.totalUnpaidPayouts;

  const payoutChartData = {
    labels: [ 'Platform Profit','Total Sales'],
    datasets: [
      {
        data: [ platformProfit,totalSales],
        backgroundColor: ['#4ade80', '#f87171'],
        // hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };




  
  return (
    <div className="analytics-dashboard p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Platform Analytics</h2>

      {/* Filter Dropdown */}
      <div className="filter-dropdown mb-6">
        <label className="mr-2 font-medium">Filter by:</label>
        <select
          className="p-2 border rounded"
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
        >
          {FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Charts */}
      
      <div className="flex " style={
        
        {
          display:'flex',
          gap:'10%', 
          width:'100%',
          height:'100%',
          padding:'20px'
        }      
                }>
        {/* Pie Chart - Users */}
        <div className="card bg-white p-5 rounded shadow  "   style={
          {
            width:'40%',
            
            // padding:'20px !important'
          }
        }>
          <h3 className="text-lg font-medium mb-4">User Distribution ({selectedRange})</h3>
          <Pie data={userChartData} />
        </div>

        {/* Pie Chart - Sales & Profit */}
        <div className="card bg-white p-5 rounded shadow  "   style={
          {
            width:'40%',
            // height:'50%'
          }
        }>
          <h3 className="text-lg font-medium mb-4">Sales & Profit ({selectedRange})</h3>
          <Pie data={payoutChartData} />
        </div>
        
      </div>
    </div>
  );
}
