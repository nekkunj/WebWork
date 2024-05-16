import { Tabs } from 'antd';
import './ScrollableTabs.css'; // Import custom CSS styles

const { TabPane } = Tabs;

const ScrollableTabs: React.FC = () => {
  return (
    <div className="scrollable-tabs-container"> {/* Container with fixed width */}
      <Tabs
        type="editable-card"
        tabBarGutter={5}
        tabBarStyle={{ overflow: 'auto', scrollBehavior: 'smooth' }}
      >
        <TabPane tab="Tab 1" key="1">
          Content of Tab 1
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          Content of Tab 2
        </TabPane>
        <TabPane tab="Tab 3" key="3">
          Content of Tab 3
        </TabPane>
        <TabPane tab="Tab 4" key="4">
          Content of Tab 4
        </TabPane>
        <TabPane tab="Tab 5" key="5">
          Content of Tab 5
        </TabPane>
        <TabPane tab="Tab 6" key="6">
          Content of Tab 6
        </TabPane>
        <TabPane tab="Tab 7" key="7">
          Content of Tab 7
        </TabPane>
        <TabPane tab="Tab 8" key="8">
          Content of Tab 8
        </TabPane>
        <TabPane tab="Tab 9" key="9">
          Content of Tab 9
        </TabPane>
        <TabPane tab="Tab 10" key="10">
          Content of Tab 10
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ScrollableTabs;
