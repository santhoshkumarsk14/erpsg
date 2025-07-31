import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  contentClassName?: string;
  vertical?: boolean;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  activeTab: activeTabProp,
  onChange,
  className = '',
  tabClassName = '',
  activeTabClassName = '',
  contentClassName = '',
  vertical = false,
}) => {
  const [internalActiveTabId, setInternalActiveTabId] = useState<string>(
    defaultTabId || (tabs.length > 0 ? tabs[0].id : '')
  );
  
  // Use either controlled (activeTab) or uncontrolled (internalActiveTabId) state
  const activeTabId = activeTabProp !== undefined ? activeTabProp : internalActiveTabId;

  const handleTabClick = (tabId: string) => {
    // Only update internal state if we're not in controlled mode
    if (activeTabProp === undefined) {
      setInternalActiveTabId(tabId);
    }
    
    if (onChange) {
      onChange(tabId);
    }
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  // Default classes
  const defaultTabsContainerClass = vertical
    ? 'flex flex-col sm:flex-row'
    : 'flex flex-col';
  const defaultTabListClass = vertical
    ? 'flex flex-col border-r border-gray-200 sm:w-64'
    : 'flex overflow-x-auto border-b border-gray-200';
  const defaultTabClass = vertical
    ? 'px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-l-2 border-transparent'
    : 'px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent';
  const defaultActiveTabClass = vertical
    ? 'text-primary border-l-2 border-primary bg-primary-light'
    : 'text-primary border-b-2 border-primary';
  const defaultContentClass = vertical
    ? 'flex-1 p-4'
    : 'p-4';

  // Combined classes
  const tabsContainerClass = `${defaultTabsContainerClass} ${className}`;
  const tabListClass = defaultTabListClass;
  const tabItemClass = `${defaultTabClass} ${tabClassName}`;
  const activeTabItemClass = `${defaultActiveTabClass} ${activeTabClassName}`;
  const contentClass = `${defaultContentClass} ${contentClassName}`;

  return (
    <div className={tabsContainerClass}>
      <div className={tabListClass}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            className={`${tabItemClass} ${activeTabId === tab.id ? activeTabItemClass : ''} ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={tab.disabled}
            aria-selected={activeTabId === tab.id}
            role="tab"
          >
            <div className="flex items-center">
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </div>
          </button>
        ))}
      </div>
      <div className={contentClass}>
        {activeTab ? activeTab.content : null}
      </div>
    </div>
  );
};

export default Tabs;