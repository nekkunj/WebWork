import React, { useState } from 'react';
import { Table, Input, Select, Button } from 'antd';

const { Option } = Select;
interface ProjectData {
    userEmail: string;
    userRole: string;
    project: string;
    createdAt: string;
  }
  
  const data: ProjectData[] = [
    { userEmail: "user1@example.com", userRole: "Admin", project: "Project A", createdAt: "2023-10-25" },
    { userEmail: "user2@example.com", userRole: "User", project: "Project B", createdAt: "2023-10-24" },
    // Add more data items as needed
  ];
  
const ProjectTable: React.FC = () => {
  const [filteredData, setFilteredData] = useState(data);
  const [filters, setFilters] = useState({
    userEmail: '',
    project: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleSearch = () => {
    const filtered = data.filter((item) => {
      return (
        item.userEmail.includes(filters.userEmail) &&
        item.project.includes(filters.project)
      );
    });

    setFilteredData(filtered);
  };

  const columns = [
    {
      title: 'User Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
      filters: data.map((item) => ({ text: item.userEmail, value: item.userEmail })),
      onFilter: (value:any, record:any) => record.userEmail.includes(value),
    },
    {
      title: 'User Role',
      dataIndex: 'userRole',
      key: 'userRole',
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
      filters: data.map((item) => ({ text: item.project, value: item.project })),
      onFilter: (value:any, record:any) => record.project.includes(value),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_:any, record:any) => (
        <Button type="link" onClick={() => handleDelete(record)}>
          Delete
        </Button>
      ),
    },
  ];

  const handleDelete = (record: ProjectData) => {
    // Implement your delete logic here
    // You can remove the 'record' from the 'data' array and update the state
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search User Email"
          value={filters.userEmail}
          onChange={(e) => handleFilterChange('userEmail', e.target.value)}
        />
        <Select
          placeholder="Select Project"
          style={{ width: 200, marginLeft: 8 }}
          value={filters.project}
          onChange={(value) => handleFilterChange('project', value)}
        >
          {data.map((item) => (
            <Option key={item.project} value={item.project}>
              {item.project}
            </Option>
          ))}
        </Select>
        <Button type="primary" onClick={handleSearch} style={{ marginLeft: 8 }}>
          Search
        </Button>
      </div>
      <Table columns={columns} dataSource={filteredData} />
    </div>
  );
};

export default ProjectTable;
