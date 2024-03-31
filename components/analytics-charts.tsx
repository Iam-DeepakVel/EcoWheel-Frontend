import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";

const stats = [
  {
    name: "Realtime CO Value",
    value: "$405,091.00",
    change: "+4.75%",
    changeType: "positive",
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const AnalyticsCharts: React.FC = () => {
  const [lineChartData, setLineChartData] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [barChartData, setBarChartData] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState<any>({
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
        suggestedMax: 200,
        maxTicksLimit: 5,
      },
      x: {
        type: "category",
        offset: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  });
  const [coValue, setCoValue] = useState();

  const fetchAllFeeds = async () => {
    const url = "https://api.thingspeak.com/channels/2409021/feeds.json";
    try {
      const response = await axios.get(url);
      const data = response.data.feeds;

      console.log(data);

      const groupedData = data.reduce((acc: any, feed: any) => {
        const date = new Date(feed.created_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = {
            totalCO: 0,
            count: 0,
          };
        }
        acc[date].totalCO += Number(feed.field1);
        acc[date].count++;
        return acc;
      }, {});

      const averages = Object.entries(groupedData).map(
        ([date, { totalCO, count }]: [string, any]) => ({
          date,
          averageCO: totalCO / count,
        })
      );

      const groupedDataLine = data.reduce((acc: any, feed: any) => {
        const timestampHour = new Date(feed.created_at);
        const hour = timestampHour.getHours();
        const dateKey = `${timestampHour.toLocaleDateString()} ${hour}:00`;
        if (!acc[dateKey]) {
          acc[dateKey] = {
            totalCO: 0,
            count: 0,
          };
        }
        acc[dateKey].totalCO += Number(feed.field1);
        acc[dateKey].count++;
        return acc;
      }, {});

      const hourlyAverages = Object.entries(groupedDataLine).map(
        ([dateKey, { totalCO, count }]: [string, any]) => ({
          date: dateKey,
          averageCO: totalCO / count,
        })
      );

      const timestamps = averages.map((entry) => entry.date);
      const averageCOValues = averages.map((entry) => entry.averageCO);
      const coValues = data.map((feed: any) => Number(feed.field1));

      const timestampsLine = hourlyAverages.map((entry) => entry.date);
      const averageCOLine = hourlyAverages.map((entry) => entry.averageCO);

      setLineChartData({
        labels: timestampsLine,
        datasets: [
          {
            label: "Average CO Level (per hour)",
            data: averageCOLine,
            borderColor: "#00205b",
            backgroundColor: "rgba(132, 189, 0, 0.2)",
            borderWidth: 1,
          },
        ],
      });

      setBarChartData({
        labels: timestamps,
        datasets: [
          {
            label: "Average CO Level (per day)",
            data: averageCOValues,
            type: "bar",
            backgroundColor: "#2F2F81",
            borderWidth: 1,
            yAxisID: "y",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching all feeds:", error);
    }
  };

  async function fetchLastFeed() {
    try {
      const url = "https://api.thingspeak.com/channels/2409021/feeds/last.json";
      const { data } = await axios.get(url);
      setCoValue(data.field1);
    } catch (error) {
      console.error("Error fetching last feed:", error);
    }
  }
  useEffect(() => {
    fetchAllFeeds();
    fetchLastFeed();
  }, []);

  return (
    <div className="flex">
      <div className="container mx-auto px-2 py-4">
        <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
          <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className={classNames(
                  "flex items-baseline flex-wrap justify-between gap-y-2 gap-x-4 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8"
                )}
              >
                <dt className="text-sm font-medium leading-6 text-gray-500">
                  {stat.name}
                </dt>
                <dd
                  className={classNames(
                    stat.changeType === "negative"
                      ? "text-rose-600"
                      : "text-gray-700",
                    "text-xs font-medium"
                  )}
                >
                  {stat.change}
                </dd>
                <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                  {coValue}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Graphs */}
        <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto mt-8">
          <div>
            <h2 className="font-semibold text-center mb-2">Line Graph</h2>
            <div
              style={{ height: "400px" }}
              className="shadow-sm p-8 rounded-lg bg-blue-50"
            >
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-center mb-2">Bar Graph</h2>
            <div
              style={{ height: "400px" }}
              className="shadow-sm p-8 rounded-lg bg-blue-50"
            >
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
