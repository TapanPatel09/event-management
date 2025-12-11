/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { ProgressBar } from 'primereact/progressbar';
import EventLayout from '../layout/EventLayout';

interface EventStats {
  totalRegistrations: number;
  totalAttendees: number;
  conversionRate: number;
  revenueGenerated: number;
}

interface AttendeeData {
  id: string;
  name: string;
  email: string;
  registrationDate: Date;
  attended: boolean;
  feedback?: string;
  rating?: number;
}


const EventAnalytics: React.FC = () => {
  // Sample data - in a real app, you would fetch this from an API
  const [stats] = useState<EventStats>({
    totalRegistrations: 250,
    totalAttendees: 180,
    conversionRate: 72,
    revenueGenerated: 9500
  });

  const [attendees, setAttendees] = useState<AttendeeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [dateRange, setDateRange] = useState<Date[]>([new Date(new Date().setDate(new Date().getDate() - 30)), new Date()]);
  const [timeframe, setTimeframe] = useState<string>('month');

  const timeframeOptions = [
    { label: 'Last 7 Days', value: 'week' },
    { label: 'Last 30 Days', value: 'month' },
    { label: 'Last 3 Months', value: 'quarter' },
    { label: 'Last Year', value: 'year' },
    { label: 'Custom', value: 'custom' }
  ];

  // Sample registration trend data
  const [registrationData, setRegistrationData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Registrations',
        data: [] as number[],
        fill: false,
        borderColor: '#4bc0c0',
        tension: 0.4
      }
    ]
  });

  // Sample attendance breakdown data
  const [attendanceData] = useState({
    labels: ['Attended', 'No-shows'],
    datasets: [
      {
        data: [180, 70],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384']
      }
    ]
  });

  // Sample feedback ratings data
  const [feedbackData] = useState({
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [
      {
        label: 'Ratings',
        data: [60, 80, 20, 15, 5],
        backgroundColor: ['#66BB6A', '#42A5F5', '#FFA726', '#EF5350', '#EC407A'],
        hoverBackgroundColor: ['#66BB6A', '#42A5F5', '#FFA726', '#EF5350', '#EC407A']
      }
    ]
  });

  // Generate sample registration trend data based on timeframe
  useEffect(() => {
    const generateTrendData = () => {
      let days = 30;
      switch (timeframe) {
        case 'week':
          days = 7;
          break;
        case 'month':
          days = 30;
          break;
        case 'quarter':
          days = 90;
          break;
        case 'year':
          days = 365;
          break;
        default:
          days = 30;
      }

      const labels: string[] = [];
      const data: number[] = [];
      
      const endDate = new Date();
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(endDate.getDate() - i);
        labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
        
        // Generate random registration counts
        data.push(Math.floor(Math.random() * 20) + 1);
      }

      setRegistrationData({
        labels,
        datasets: [
          {
            label: 'Registrations',
            data,
            fill: false,
            borderColor: '#4bc0c0',
            tension: 0.4
          }
        ]
      });
    };

    generateTrendData();
  }, [timeframe]);

  // Generate sample attendee data
  useEffect(() => {
    const generateAttendeeData = () => {
      const sampleAttendees: AttendeeData[] = [];
      const names = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Sarah Williams', 'Robert Brown', 'Emily Davis'];
      const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'company.com'];
      
      for (let i = 1; i <= 50; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const email = `${name.toLowerCase().replace(' ', '.')}@${domain}`;
        const attended = Math.random() > 0.3;
        const rating = attended ? Math.floor(Math.random() * 5) + 1 : undefined;
        
        sampleAttendees.push({
          id: `ATT-${1000 + i}`,
          name,
          email,
          registrationDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          attended,
          feedback: attended ? ['Great event!', 'Very informative', 'Could be better', 'Excellent speakers'][Math.floor(Math.random() * 4)] : undefined,
          rating
        });
      }
      
      setAttendees(sampleAttendees);
      setLoading(false);
    };

    generateAttendeeData();
  }, []);

  // Charts options
  const lineOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };

  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    }
  };

  // Template for date display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US').format(date);
  };

  const dateBodyTemplate = (rowData: AttendeeData) => {
    return formatDate(rowData.registrationDate);
  };

  const attendanceBodyTemplate = (rowData: AttendeeData) => {
    return (
      <span className={`px-3 py-1 rounded-full text-white ${rowData.attended ? 'bg-green-500' : 'bg-red-500'}`}>
        {rowData.attended ? 'Yes' : 'No'}
      </span>
    );
  };

  const ratingBodyTemplate = (rowData: AttendeeData) => {
    if (!rowData.rating) return 'N/A';
    
    return (
      <div className="flex">
        {[...Array(rowData.rating)].map((_, i) => (
          <i key={i} className="pi pi-star-fill text-yellow-500 mr-1"></i>
        ))}
        {[...Array(5 - rowData.rating)].map((_, i) => (
          <i key={i} className="pi pi-star text-gray-300 mr-1"></i>
        ))}
      </div>
    );
  };

  const handleTimeframeChange = (e: any) => {
    setTimeframe(e.value);
    if (e.value !== 'custom') {
      // Reset custom date range when selecting a predefined timeframe
      const endDate = new Date();
      const startDate = new Date();
      
      switch (e.value) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case 'quarter':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case 'year':
          startDate.setDate(endDate.getDate() - 365);
          break;
      }
      
      setDateRange([startDate, endDate]);
    }
  };

  const exportCSV = () => {
    console.log('Exporting data as CSV...');
  };

  return (
    <EventLayout>

    <div className="font-sans p-4">
      <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold p-4">Event Analytics Dashboard</h1>
      <div className="flex items-center gap-2">
        <div>
          <span className="p-float-label">
            <Dropdown
              id="timeframe"
              value={timeframe}
              options={timeframeOptions}
              onChange={handleTimeframeChange}
              className="w-48 bg-white shadow-lg border-2"
              />
          </span>
        </div>
        
        {timeframe === 'custom' && (
          <div>
            <span className="p-float-label mt-1">
              <Calendar
                id="dateRange"
                value={dateRange}
                onChange={(e) => setDateRange(e.value as Date[])}
                selectionMode="range"
                readOnlyInput
                className="w-64"
                />
              <label htmlFor="dateRange">Date Range</label>
            </span>
          </div>
        )}
        
      
        <button 
          className="p-button-outlined rounded text-white bg-red-500 p-2 p-button-secondary"
          onClick={exportCSV}
          >Export Data</button>
      </div>
      </div>
      
      {/* Filter Controls */}
      
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-md">
          <div className="text-center">
            <div className="text-500 font-medium mb-2">Total Registrations</div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalRegistrations}</div>
            <span className="text-green-500 font-medium">
              <i className="pi pi-arrow-up mr-1"></i>12% 
              <span className="text-gray-500 ml-1">vs last event</span>
            </span>
          </div>
        </Card>
        
        <Card className="shadow-md">
          <div className="text-center">
            <div className="text-500 font-medium mb-2">Total Attendees</div>
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalAttendees}</div>
            <span className="text-green-500 font-medium">
              <i className="pi pi-arrow-up mr-1"></i>5% 
              <span className="text-gray-500 ml-1">vs last event</span>
            </span>
          </div>
        </Card>
        
        <Card className="shadow-md">
          <div className="text-center">
            <div className="text-500 font-medium mb-2">Conversion Rate</div>
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.conversionRate}%</div>
            <ProgressBar value={stats.conversionRate} showValue={false} className="h-2 mt-2" />
          </div>
        </Card>
        
        <Card className="shadow-md">
          <div className="text-center">
            <div className="text-500 font-medium mb-2">Revenue Generated</div>
            <div className="text-3xl font-bold text-purple-600 mb-2">${stats.revenueGenerated}</div>
            <span className="text-red-500 font-medium">
              <i className="pi pi-arrow-down mr-1"></i>3% 
              <span className="text-gray-500 ml-1">vs projected</span>
            </span>
          </div>
        </Card>
      </div>
      
      {/* Charts and Tables */}
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="Registration Trends">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Registration Trends</h2>
            <Chart type="line" data={registrationData} options={lineOptions} className="h-96" />
          </div>
        </TabPanel>
        
        <TabPanel header="Attendance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Attendance Breakdown</h2>
              <Chart type="pie" data={attendanceData} options={pieOptions} className="h-80" />
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Feedback Ratings</h2>
              <Chart type="bar" data={feedbackData} options={pieOptions} className="h-80" />
            </div>
          </div>
        </TabPanel>
        
        <TabPanel header="Attendee Details">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Attendee List</h2>
            <DataTable 

              value={attendees} 
              paginator 
              rows={10} 
              rowsPerPageOptions={[5, 10, 25]} 
              loading={loading}
              responsiveLayout="scroll"
              emptyMessage="No attendees found."
              className="table-one p-datatable-sm"
            >
              <Column field="id" header="ID" sortable style={{ width: '10%' }} />
              <Column field="name" header="Name" sortable style={{ width: '20%' }} />
              <Column field="email" header="Email" sortable style={{ width: '25%' }} />
              <Column field="registrationDate" header="Registration Date" body={dateBodyTemplate} sortable style={{ width: '15%' }} />
              <Column field="attended" header="Attended" body={attendanceBodyTemplate} sortable style={{ width: '15%' }} />
              <Column field="rating" header="Rating" body={ratingBodyTemplate} sortable style={{ width: '15%' }} />
            </DataTable>
          </div>
        </TabPanel>
      </TabView>
    </div>  
              </EventLayout>
  );
};

export default EventAnalytics;