
"use client";

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

type UserData = {
  login: string;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
  created_at: string;
};

type RepoData = {
  name: string;
  stargazers_count: number;
  forks_count: number;
  size: number;
  updated_at: string;
};

interface UserChartsProps {
  userData: UserData;
}

export default function UserCharts({ userData }: UserChartsProps) {
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [selectedChart, setSelectedChart] = useState<string>('activity');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserRepos = async () => {
      if (!userData?.login) return;
      
      setLoading(true);
      setError('');
      
      try {
        const res = await fetch(`https://api.github.com/users/${userData.login}/repos?sort=updated&per_page=5`);
        if (!res.ok) {
          throw new Error("Failed to fetch repositories");
        }
        
        const data = await res.json();
        setRepos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserRepos();
  }, [userData]);

  // Function to format date for charts
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Chart data configurations
  const activityOverviewData = {
    labels: ['Followers', 'Following', 'Public Repos', 'Public Gists'],
    datasets: [
      {
        label: 'Count',
        data: [
          userData.followers,
          userData.following,
          userData.public_repos,
          userData.public_gists,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 206, 86, 0.7)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const topReposData = {
    labels: repos.map(repo => repo.name),
    datasets: [
      {
        label: 'Stars',
        data: repos.map(repo => repo.stargazers_count),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Forks',
        data: repos.map(repo => repo.forks_count),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const repoSizeData = {
    labels: repos.map(repo => repo.name),
    datasets: [
      {
        label: 'Size (KB)',
        data: repos.map(repo => repo.size),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const activityRadarData = {
    labels: ['Followers', 'Following', 'Repos', 'Gists', 'Stars'],
    datasets: [
      {
        label: 'GitHub Activity',
        data: [
          userData.followers,
          userData.following,
          userData.public_repos,
          userData.public_gists,
          repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="w-full">
      {loading && <p className="text-center my-2">Loading chart data...</p>}
      {error && <p className="text-center text-red-500 my-2">{error}</p>}

      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setSelectedChart('activity')}
          className={`px-3 py-1 rounded ${selectedChart === 'activity' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          Activity Overview
        </button>
        <button
          onClick={() => setSelectedChart('topRepos')}
          className={`px-3 py-1 rounded ${selectedChart === 'topRepos' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          Top Repositories
        </button>
        <button
          onClick={() => setSelectedChart('repoSize')}
          className={`px-3 py-1 rounded ${selectedChart === 'repoSize' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          Repository Sizes
        </button>
        <button
          onClick={() => setSelectedChart('radar')}
          className={`px-3 py-1 rounded ${selectedChart === 'radar' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          Activity Radar
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        {selectedChart === 'activity' && (
          <div className="h-80">
            <h3 className="text-center text-xl mb-2">Activity Overview</h3>
            <Doughnut 
              data={activityOverviewData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
              }} 
            />
          </div>
        )}

        {selectedChart === 'topRepos' && (
          <div className="h-80">
            <h3 className="text-center text-xl mb-2">Top Repositories</h3>
            <Bar 
              data={topReposData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        )}

        {selectedChart === 'repoSize' && (
          <div className="h-80">
            <h3 className="text-center text-xl mb-2">Repository Sizes</h3>
            <Line 
              data={repoSizeData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        )}

        {selectedChart === 'radar' && (
          <div className="h-80">
            <h3 className="text-center text-xl mb-2">Activity Radar</h3>
            <Radar 
              data={activityRadarData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
