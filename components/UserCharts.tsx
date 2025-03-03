
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
  PolarAreaController,
  ScatterController,
  BubbleController,
} from 'chart.js';
import { Bar, Doughnut, Line, Radar, PolarArea, Scatter, Bubble, Pie } from 'react-chartjs-2';

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
  RadialLinearScale,
  PolarAreaController,
  ScatterController,
  BubbleController
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
  language: string;
  open_issues_count: number;
  watchers_count: number;
};

interface UserChartsProps {
  userData: UserData;
}

export default function UserCharts({ userData }: UserChartsProps) {
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [selectedChart, setSelectedChart] = useState<string>('activity');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [chartTheme, setChartTheme] = useState<string>('dark');
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<number>(5); // Number of repos to display

  // Color themes
  const themes = {
    dark: {
      primary: ['rgba(54, 162, 235, 0.7)', 'rgba(54, 162, 235, 1)'],
      secondary: ['rgba(255, 99, 132, 0.7)', 'rgba(255, 99, 132, 1)'],
      tertiary: ['rgba(75, 192, 192, 0.7)', 'rgba(75, 192, 192, 1)'],
      quaternary: ['rgba(255, 206, 86, 0.7)', 'rgba(255, 206, 86, 1)'],
      quinary: ['rgba(153, 102, 255, 0.7)', 'rgba(153, 102, 255, 1)'],
      senary: ['rgba(255, 159, 64, 0.7)', 'rgba(255, 159, 64, 1)'],
      septenary: ['rgba(199, 199, 199, 0.7)', 'rgba(199, 199, 199, 1)'],
      octonary: ['rgba(83, 223, 83, 0.7)', 'rgba(83, 223, 83, 1)'],
    },
    light: {
      primary: ['rgba(54, 162, 235, 0.5)', 'rgba(54, 162, 235, 0.8)'],
      secondary: ['rgba(255, 99, 132, 0.5)', 'rgba(255, 99, 132, 0.8)'],
      tertiary: ['rgba(75, 192, 192, 0.5)', 'rgba(75, 192, 192, 0.8)'],
      quaternary: ['rgba(255, 206, 86, 0.5)', 'rgba(255, 206, 86, 0.8)'],
      quinary: ['rgba(153, 102, 255, 0.5)', 'rgba(153, 102, 255, 0.8)'],
      senary: ['rgba(255, 159, 64, 0.5)', 'rgba(255, 159, 64, 0.8)'],
      septenary: ['rgba(119, 119, 119, 0.5)', 'rgba(119, 119, 119, 0.8)'],
      octonary: ['rgba(83, 223, 83, 0.5)', 'rgba(83, 223, 83, 0.8)'],
    },
    neon: {
      primary: ['rgba(0, 255, 255, 0.7)', 'rgba(0, 255, 255, 1)'],
      secondary: ['rgba(255, 0, 255, 0.7)', 'rgba(255, 0, 255, 1)'],
      tertiary: ['rgba(0, 255, 0, 0.7)', 'rgba(0, 255, 0, 1)'],
      quaternary: ['rgba(255, 255, 0, 0.7)', 'rgba(255, 255, 0, 1)'],
      quinary: ['rgba(0, 128, 255, 0.7)', 'rgba(0, 128, 255, 1)'],
      senary: ['rgba(255, 128, 0, 0.7)', 'rgba(255, 128, 0, 1)'],
      septenary: ['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 1)'],
      octonary: ['rgba(0, 255, 128, 0.7)', 'rgba(0, 255, 128, 1)'],
    }
  };

  // Selected theme colors
  const colors = themes[chartTheme as keyof typeof themes];

  useEffect(() => {
    const fetchUserRepos = async () => {
      if (!userData?.login) return;
      
      setLoading(true);
      setError('');
      
      try {
        const res = await fetch(`https://api.github.com/users/${userData.login}/repos?sort=updated&per_page=${dateRange}`);
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
  }, [userData, dateRange]);

  // Function to format date for charts
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate account age in years
  const calculateAccountAge = () => {
    const createdDate = new Date(userData.created_at);
    const now = new Date();
    return ((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
  };

  // Extract languages from repos
  const extractLanguages = () => {
    const languages: Record<string, number> = {};
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });
    return languages;
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
          colors.primary[0],
          colors.secondary[0],
          colors.tertiary[0],
          colors.quaternary[0],
        ],
        borderColor: [
          colors.primary[1],
          colors.secondary[1],
          colors.tertiary[1],
          colors.quaternary[1],
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
        backgroundColor: colors.primary[0],
        borderColor: colors.primary[1],
        borderWidth: 1,
      },
      {
        label: 'Forks',
        data: repos.map(repo => repo.forks_count),
        backgroundColor: colors.secondary[0],
        borderColor: colors.secondary[1],
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
        backgroundColor: colors.tertiary[0],
        borderColor: colors.tertiary[1],
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
        backgroundColor: colors.secondary[0],
        borderColor: colors.secondary[1],
        borderWidth: 2,
      },
    ],
  };

  const languageDistribution = {
    labels: Object.keys(extractLanguages()),
    datasets: [
      {
        label: 'Languages',
        data: Object.values(extractLanguages()),
        backgroundColor: [
          colors.primary[0],
          colors.secondary[0],
          colors.tertiary[0],
          colors.quaternary[0],
          colors.quinary[0],
          colors.senary[0],
          colors.septenary[0],
          colors.octonary[0],
        ],
        borderColor: [
          colors.primary[1],
          colors.secondary[1],
          colors.tertiary[1],
          colors.quaternary[1],
          colors.quinary[1],
          colors.senary[1],
          colors.septenary[1],
          colors.octonary[1],
        ],
        borderWidth: 1,
      },
    ],
  };

  const repoIssuesData = {
    labels: repos.map(repo => repo.name),
    datasets: [
      {
        label: 'Open Issues',
        data: repos.map(repo => repo.open_issues_count),
        backgroundColor: colors.quaternary[0],
        borderColor: colors.quaternary[1],
        borderWidth: 1,
      },
    ],
  };

  const repoPopularityBubbleData = {
    datasets: [
      {
        label: 'Repository Popularity',
        data: repos.map(repo => ({
          x: repo.forks_count,
          y: repo.stargazers_count,
          r: Math.max(5, Math.min(20, repo.watchers_count / 2 || 5)),
        })),
        backgroundColor: repos.map((_, index) => {
          const colorKeys = Object.keys(colors);
          const colorKey = colorKeys[index % colorKeys.length] as keyof typeof colors;
          return colors[colorKey][0];
        }),
      },
    ],
  };

  const engagementRatioData = {
    labels: ['Followers to Following', 'Stars to Repos', 'Watchers to Repos'],
    datasets: [
      {
        label: 'Engagement Ratios',
        data: [
          userData.followers / (userData.following || 1),
          repos.reduce((sum, repo) => sum + repo.stargazers_count, 0) / (userData.public_repos || 1),
          repos.reduce((sum, repo) => sum + repo.watchers_count, 0) / (userData.public_repos || 1),
        ],
        backgroundColor: [colors.primary[0], colors.secondary[0], colors.tertiary[0]],
        borderColor: [colors.primary[1], colors.secondary[1], colors.tertiary[1]],
        borderWidth: 1,
      },
    ],
  };

  // Base options for all charts
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: animationsEnabled ? 1000 : 0,
    },
    plugins: {
      legend: {
        labels: {
          color: chartTheme === 'dark' ? 'white' : 'black',
        },
      },
      tooltip: {
        backgroundColor: chartTheme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: chartTheme === 'dark' ? 'white' : 'black',
        bodyColor: chartTheme === 'dark' ? 'white' : 'black',
        borderColor: colors.primary[1],
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: chartTheme === 'dark' ? 'white' : 'black',
        },
        grid: {
          color: chartTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: chartTheme === 'dark' ? 'white' : 'black',
        },
        grid: {
          color: chartTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      r: {
        ticks: {
          color: chartTheme === 'dark' ? 'white' : 'black',
        },
        grid: {
          color: chartTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="w-full">
      {loading && <p className="text-center my-2">Loading chart data...</p>}
      {error && <p className="text-center text-red-500 my-2">{error}</p>}

      <div className="flex flex-wrap gap-2 justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          <select 
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
            value={chartTheme}
            onChange={(e) => setChartTheme(e.target.value)}
          >
            <option value="dark">Dark Theme</option>
            <option value="light">Light Theme</option>
            <option value="neon">Neon Theme</option>
          </select>
          
          <select 
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
            value={dateRange}
            onChange={(e) => setDateRange(parseInt(e.target.value))}
          >
            <option value="5">5 Repos</option>
            <option value="10">10 Repos</option>
            <option value="15">15 Repos</option>
            <option value="20">20 Repos</option>
          </select>
          
          <button
            onClick={() => setAnimationsEnabled(!animationsEnabled)}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
          >
            {animationsEnabled ? "Disable Animations" : "Enable Animations"}
          </button>
        </div>
      </div>

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
        <button
          onClick={() => setSelectedChart('languages')}
          className={`px-3 py-1 rounded ${selectedChart === 'languages' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          Languages
        </button>
        <button
          onClick={() => setSelectedChart('issues')}
          className={`px-3 py-1 rounded ${selectedChart === 'issues' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          Issues
        </button>
        <button
          onClick={() => setSelectedChart('bubble')}
          className={`px-3 py-1 rounded ${selectedChart === 'bubble' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          Popularity
        </button>
        <button
          onClick={() => setSelectedChart('engagement')}
          className={`px-3 py-1 rounded ${selectedChart === 'engagement' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          Engagement
        </button>
      </div>

      <div className={`p-4 rounded-lg ${chartTheme === 'dark' ? 'bg-gray-800' : chartTheme === 'light' ? 'bg-gray-200' : 'bg-gray-900'}`}>
        {selectedChart === 'activity' && (
          <div className="h-80">
            <h3 className={`text-center text-xl mb-2 ${chartTheme === 'light' ? 'text-black' : 'text-white'}`}>
              Activity Overview - {calculateAccountAge()} Years on GitHub
            </h3>
            <Doughnut 
              data={activityOverviewData} 
              options={baseOptions} 
            />
          </div>
        )}

        {selectedChart === 'topRepos' && (
          <div className="h-80">
            <h3 className={`text-center text-xl mb-2 ${chartTheme === 'light' ? 'text-black' : 'text-white'}`}>
              Top Repositories - Stars & Forks
            </h3>
            <Bar 
              data={topReposData} 
              options={baseOptions} 
            />
          </div>
        )}

        {selectedChart === 'repoSize' && (
          <div className="h-80">
            <h3 className={`text-center text-xl mb-2 ${chartTheme === 'light' ? 'text-black' : 'text-white'}`}>
              Repository Sizes (KB)
            </h3>
            <Line 
              data={repoSizeData} 
              options={baseOptions} 
            />
          </div>
        )}

        {selectedChart === 'radar' && (
          <div className="h-80">
            <h3 className={`text-center text-xl mb-2 ${chartTheme === 'light' ? 'text-black' : 'text-white'}`}>
              Activity Radar
            </h3>
            <Radar 
              data={activityRadarData} 
              options={baseOptions} 
            />
          </div>
        )}

        {selectedChart === 'languages' && (
          <div className="h-80">
            <h3 className={`text-center text-xl mb-2 ${chartTheme === 'light' ? 'text-black' : 'text-white'}`}>
              Language Distribution
            </h3>
            <PolarArea 
              data={languageDistribution} 
              options={baseOptions} 
            />
          </div>
        )}

        {selectedChart === 'issues' && (
          <div className="h-80">
            <h3 className={`text-center text-xl mb-2 ${chartTheme === 'light' ? 'text-black' : 'text-white'}`}>
              Open Issues by Repository
            </h3>
            <Bar 
              data={repoIssuesData} 
              options={baseOptions} 
            />
          </div>
        )}

        {selectedChart === 'bubble' && (
          <div className="h-80">
            <h3 className={`text-center text-xl mb-2 ${chartTheme === 'light' ? 'text-black' : 'text-white'}`}>
              Repository Popularity (Forks vs Stars)
            </h3>
            <Bubble 
              data={repoPopularityBubbleData} 
              options={{
                ...baseOptions,
                scales: {
                  ...baseOptions.scales,
                  x: {
                    ...baseOptions.scales.x,
                    title: {
                      display: true,
                      text: 'Forks',
                      color: chartTheme === 'dark' ? 'white' : 'black',
                    },
                  },
                  y: {
                    ...baseOptions.scales.y,
                    title: {
                      display: true,
                      text: 'Stars',
                      color: chartTheme === 'dark' ? 'white' : 'black',
                    },
                  },
                },
                plugins: {
                  ...baseOptions.plugins,
                  tooltip: {
                    ...baseOptions.plugins.tooltip,
                    callbacks: {
                      label: function(context: any) {
                        const repo = repos[context.dataIndex];
                        return [
                          `${repo.name}`,
                          `Forks: ${repo.forks_count}`,
                          `Stars: ${repo.stargazers_count}`,
                          `Watchers: ${repo.watchers_count}`
                        ];
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        )}

        {selectedChart === 'engagement' && (
          <div className="h-80">
            <h3 className={`text-center text-xl mb-2 ${chartTheme === 'light' ? 'text-black' : 'text-white'}`}>
              Engagement Ratios
            </h3>
            <Pie 
              data={engagementRatioData} 
              options={{
                ...baseOptions,
                plugins: {
                  ...baseOptions.plugins,
                  tooltip: {
                    ...baseOptions.plugins.tooltip,
                    callbacks: {
                      label: function(context: any) {
                        const value = context.raw;
                        return `Ratio: ${value.toFixed(2)}`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        )}
      </div>

      <div className="mt-4 p-2 bg-gray-700 rounded text-xs">
        <p className="text-center">Data based on {repos.length} repositories. Updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}
